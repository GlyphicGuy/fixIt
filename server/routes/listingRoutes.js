const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  addInterestedFixer,
  getUserListings
} = require('../controllers/listingController');

// Public routes
router.get('/', getListings);
router.get('/:id', getListingById);
router.get('/user/:userId', getUserListings);

// Protected routes
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.post('/:id/interest', protect, addInterestedFixer);

module.exports = router;
