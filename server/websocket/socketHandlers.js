const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Listing = require('../models/Listing');

// Store active users for presence tracking
const activeUsers = new Map(); // userId -> { socketId, conversationIds }

module.exports = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.userId;
    
    // Track user presence
    if (!activeUsers.has(userId)) {
      activeUsers.set(userId, { socketId: socket.id, conversationIds: new Set() });
      io.emit('user:online', { userId, socketId: socket.id });
    } else {
      activeUsers.get(userId).socketId = socket.id;
    }

    console.log(`✅ User ${userId} connected with socket ${socket.id}`);

    /**
     * JOIN CONVERSATION
     * Client emits: { conversationId, listingId, otherUserId }
     */
    socket.on('conversation:join', async (data) => {
      try {
        const { conversationId, listingId, otherUserId } = data;
        const userSet = activeUsers.get(userId);

        // Verify listing access
        const listing = await Listing.findById(listingId);
        if (!listing) {
          socket.emit('error', { message: 'Listing not found' });
          return;
        }

        const isAuthorized = 
          listing.postedBy.toString() === userId ||
          listing.interestedFixers.some(item => item.fixer.toString() === userId) ||
          listing.acceptedFixer?.toString() === userId;

        if (!isAuthorized) {
          socket.emit('error', { message: 'Not authorized to access this conversation' });
          return;
        }

        // Get or create conversation
        let conversation = await Conversation.findOne({
          listing: listingId,
          participants: { $all: [userId, otherUserId] }
        })
        .populate('participants', 'name email photoUrl')
        .populate('lastMessage');

        if (!conversation) {
          conversation = await Conversation.create({
            listing: listingId,
            participants: [userId, otherUserId]
          });

          conversation = await Conversation.findById(conversation._id)
            .populate('participants', 'name email photoUrl');
        }

        // Join socket room
        socket.join(conversationId);
        userSet.conversationIds.add(conversationId);

        // Fetch message history (last 50 messages)
        const messages = await Message.find({ conversation: conversationId })
          .populate('sender', 'name photoUrl')
          .sort({ createdAt: -1 })
          .limit(50);

        // Check if other user is online
        const otherUserData = activeUsers.get(otherUserId);
        const otherUserOnline = !!otherUserData;

        // Send conversation data to client
        socket.emit('conversation:loaded', {
          conversation,
          messages: messages.reverse(),
          otherUserOnline
        });

        // Notify other user that current user has joined
        io.to(conversationId).emit('user:typing', {
          userId,
          isTyping: false,
          userName: socket.user.name
        });

        console.log(`👥 User ${userId} joined conversation ${conversationId}`);
      } catch (error) {
        console.error('Error joining conversation:', error);
        socket.emit('error', { message: error.message });
      }
    });

    /**
     * SEND MESSAGE
     * Client emits: { conversationId, content }
     */
    socket.on('message:send', async (data) => {
      try {
        const { conversationId, content } = data;

        if (!content || !content.trim()) {
          socket.emit('error', { message: 'Message content is required' });
          return;
        }

        // Verify conversation exists and user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        if (!conversation.participants.includes(userId)) {
          socket.emit('error', { message: 'Not authorized to send messages' });
          return;
        }

        // Create message
        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          content: content.trim()
        });

        // Populate sender details
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name photoUrl');

        // Update conversation lastMessage
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        // Broadcast to all participants in conversation
        io.to(conversationId).emit('message:received', {
          id: populatedMessage._id,
          conversationId,
          sender: populatedMessage.sender,
          content: populatedMessage.content,
          createdAt: populatedMessage.createdAt,
          read: false
        });

        console.log(`💬 Message sent in conversation ${conversationId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: error.message });
      }
    });

    /**
     * TYPING INDICATOR
     * Client emits: { conversationId, isTyping }
     */
    socket.on('user:typing', (data) => {
      try {
        const { conversationId, isTyping } = data;

        io.to(conversationId).emit('user:typing', {
          userId,
          isTyping,
          userName: socket.user.name
        });
      } catch (error) {
        console.error('Error sending typing indicator:', error);
      }
    });

    /**
     * MARK MESSAGE AS READ
     * Client emits: { conversationId, messageIds }
     */
    socket.on('message:markAsRead', async (data) => {
      try {
        const { conversationId, messageIds } = data;

        await Message.updateMany(
          { _id: { $in: messageIds }, sender: { $ne: userId } },
          { read: true, readAt: new Date() }
        );

        io.to(conversationId).emit('message:read', {
          userId,
          messageIds,
          readAt: new Date()
        });

        console.log(`✓ Marked ${messageIds.length} messages as read`);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    /**
     * LEAVE CONVERSATION
     * Client emits: { conversationId }
     */
    socket.on('conversation:leave', (data) => {
      try {
        const { conversationId } = data;
        const userSet = activeUsers.get(userId);
        
        socket.leave(conversationId);
        if (userSet) {
          userSet.conversationIds.delete(conversationId);
        }

        console.log(`👋 User ${userId} left conversation ${conversationId}`);
      } catch (error) {
        console.error('Error leaving conversation:', error);
      }
    });

    /**
     * GET USER CONVERSATIONS
     * Client emits: {}
     */
    socket.on('conversations:get', async () => {
      try {
        const conversations = await Conversation.find({
          participants: userId
        })
        .populate('participants', 'name email')
        .populate('listing', 'title status')
        .populate({
          path: 'lastMessage',
          populate: {
            path: 'sender',
            select: 'name'
          }
        })
        .sort({ lastMessageAt: -1 });

        socket.emit('conversations:loaded', conversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        socket.emit('error', { message: error.message });
      }
    });

    /**
     * DISCONNECT
     */
    socket.on('disconnect', () => {
      const userSet = activeUsers.get(userId);
      if (userSet) {
        userSet.conversationIds.forEach(convId => {
          io.to(convId).emit('user:offline', { userId });
        });
      }

      activeUsers.delete(userId);
      io.emit('user:offline', { userId });

      console.log(`❌ User ${userId} disconnected`);
    });

    /**
     * ERROR HANDLER
     */
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};
