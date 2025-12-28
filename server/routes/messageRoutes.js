const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getConversation,
  sendMessage,
  getUserConversations,
  markAsRead
} = require('../controllers/messageController');

// All routes are protected
router.get('/conversations', protect, getUserConversations);
router.get('/conversation/:listingId/:otherUserId', protect, getConversation);
router.post('/:conversationId', protect, sendMessage);
router.put('/:conversationId/read', protect, markAsRead);

module.exports = router;
