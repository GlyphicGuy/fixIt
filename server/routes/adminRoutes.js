const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    deleteUser,
    flagUser,
    unflagUser,
    dismissReport,
    getAdminStats,
    getAllListings,
    deleteListing,
    unflagListing,
    dismissListingReport
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Public/User routes related to admin/moderation
router.put('/users/:id/flag', protect, flagUser);

// Admin only routes
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/unflag', protect, admin, unflagUser);
router.delete('/users/:userId/reports/:reportId', protect, admin, dismissReport);

router.get('/listings', protect, admin, getAllListings);
router.delete('/listings/:id', protect, admin, deleteListing);
router.put('/listings/:id/unflag', protect, admin, unflagListing);
router.delete('/listings/:listingId/reports/:reportId', protect, admin, dismissListingReport);

router.get('/stats', protect, admin, getAdminStats);

module.exports = router;
