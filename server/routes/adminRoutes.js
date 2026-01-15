const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    deleteUser,
    flagUser,
    unflagUser,
    dismissReport,
    getAdminStats
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
router.get('/stats', protect, admin, getAdminStats);

module.exports = router;
