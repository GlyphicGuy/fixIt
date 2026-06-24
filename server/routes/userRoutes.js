const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getFixers,
  reportUser,
  getUserPhoto
} = require('../controllers/userController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getUserProfile);
router.get('/:id/photo', getUserPhoto);
router.get('/fixers', getFixers);

// Protected routes
router.put('/profile', protect, updateUserProfile);
router.post('/:id/report', protect, reportUser);

module.exports = router;
