const Message = require('../models/Message');
const Listing = require('../models/Listing');

// @desc    Get or create conversation for a listing between two users
// @route   GET /api/messages/conversation/:listingId/:otherUserId
// @access  Private
const getConversation = async (req, res) => {
  try {
    const { listingId, otherUserId } = req.params;
    const currentUserId = req.user._id;

    // Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Verify user is either the poster or an interested fixer
    const isAuthorized = 
      listing.postedBy.toString() === currentUserId.toString() ||
      listing.interestedFixers.some(item => item.fixer.toString() === currentUserId.toString()) ||
      listing.acceptedFixer?.toString() === currentUserId.toString();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }

    // Find or create conversation
    let conversation = await Message.findOne({
      listing: listingId,
      participants: { $all: [currentUserId, otherUserId] }
    })
    .populate('participants', 'name email photoUrl')
    .populate('messages.sender', 'name photoUrl');

    if (!conversation) {
      // Create new conversation
      conversation = await Message.create({
        listing: listingId,
        participants: [currentUserId, otherUserId],
        messages: []
      });

      conversation = await Message.findById(conversation._id)
        .populate('participants', 'name email photoUrl')
        .populate('messages.sender', 'name photoUrl');
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/messages/:conversationId
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const conversation = await Message.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Verify user is a participant
    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({ message: 'Not authorized to send messages in this conversation' });
    }

    // Add message
    conversation.messages.push({
      sender: senderId,
      content: content.trim()
    });

    conversation.lastMessageAt = Date.now();
    await conversation.save();

    // Populate and return updated conversation
    const updatedConversation = await Message.findById(conversationId)
      .populate('participants', 'name email photoUrl')
      .populate('messages.sender', 'name photoUrl');

    res.json(updatedConversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
// @access  Private
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Message.find({
      participants: userId
    })
    .populate('participants', 'name email photoUrl')
    .populate('listing', 'title photoUrl status')
    .populate({
      path: 'messages.sender',
      select: 'name photoUrl'
    })
    .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/:conversationId/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Message.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Verify user is a participant
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark all messages from other participants as read
    conversation.messages.forEach(msg => {
      if (msg.sender.toString() !== userId.toString()) {
        msg.read = true;
      }
    });

    await conversation.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConversation,
  sendMessage,
  getUserConversations,
  markAsRead
};
