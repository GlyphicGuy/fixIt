const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
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
    let conversation = await Conversation.findOne({
      listing: listingId,
      participants: { $all: [currentUserId, otherUserId] }
    })
    .populate('participants', 'name email')
    .populate('lastMessage');

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        listing: listingId,
        participants: [currentUserId, otherUserId]
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email');
    }

    // Fetch message history (last 50 messages)
    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      conversation,
      messages: messages.reverse()
    });
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

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Verify user is a participant
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark all messages from other participants as read
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: userId } },
      { read: true, readAt: new Date() }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConversation,
  getUserConversations,
  markAsRead
};
