const User = require('../models/User');
const Listing = require('../models/Listing');

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            // Also delete user's listings
            await Listing.deleteMany({ user: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Flag a user
// @route   PUT /api/admin/users/:id/flag
// @access  Private (Authenticated users can flag)
const flagUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isFlagged = true;
            user.flagReason = req.body.reason || 'Flagged by community';
            await user.save();
            res.json({ message: 'User flagged for review' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const listingCount = await Listing.countDocuments();
        // Count users who are flagged OR have at least one report
        const flaggedUsers = await User.countDocuments({
            $or: [
                { isFlagged: true },
                { 'reports.0': { $exists: true } }
            ]
        });

        res.json({
            totalUsers: userCount,
            totalListings: listingCount,
            flaggedUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unflag a user
// @route   PUT /api/admin/users/:id/unflag
// @access  Private/Admin
const unflagUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isFlagged = false;
            user.flagReason = undefined;
            await user.save();
            res.json({ message: 'User unflagged successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Dismiss a specific report
// @route   DELETE /api/admin/users/:userId/reports/:reportId
// @access  Private/Admin
const dismissReport = async (req, res) => {
    try {
        const { userId, reportId } = req.params;
        const user = await User.findById(userId);

        if (user) {
            // Filter out the report with the given ID
            const initialLength = user.reports.length;
            user.reports = user.reports.filter(report => report._id.toString() !== reportId);

            if (user.reports.length === initialLength) {
                return res.status(404).json({ message: 'Report not found' });
            }

            await user.save();
            res.json({ message: 'Report dismissed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    flagUser,
    unflagUser,
    dismissReport,
    getAdminStats
};
