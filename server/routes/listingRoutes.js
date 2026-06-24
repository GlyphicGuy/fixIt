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
  getUserListings,
  getInterestedListings,
  acceptFixer,
  markListingFixed,
  flagListing,
  getPublicStats,
  getListingPhoto
} = require('../controllers/listingController');

// Public routes
router.get('/', getListings);
router.get('/stats', getPublicStats);
router.get('/:id/photo', getListingPhoto);
router.get('/:id', getListingById);
router.get('/user/:userId', getUserListings);
router.get('/interested/:userId', getInterestedListings);

// Protected routes
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.post('/:id/interest', protect, addInterestedFixer);
router.post('/:id/accept/:fixerId', protect, acceptFixer);
router.post('/:id/mark-fixed', protect, markListingFixed);
router.put('/:id/flag', protect, flagListing);

module.exports = router;
