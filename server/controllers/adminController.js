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
            const reason = req.body.reason || 'Flagged by community';
            const reporterId = req.user._id;

            // Check if user has already reported this target user
            const alreadyReported = user.reports.find(
                (r) => r.reporter.toString() === reporterId.toString()
            );

            if (alreadyReported) {
                return res.status(400).json({ message: 'You have already reported this user' });
            }

            user.reports.push({
                reporter: reporterId,
                reason: reason
            });

            user.isFlagged = true;
            // user.flagReason might be deprecated in favor of reports array, keeping for backward compatibility if needed, 
            // otherwise just relying on reports is better. Let's keep isFlagged boolean.

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

        const flaggedListings = await Listing.countDocuments({
            $or: [
                { isFlagged: true },
                { 'reports.0': { $exists: true } }
            ]
        });

        res.json({
            totalUsers: userCount,
            totalListings: listingCount,
            flaggedUsers,
            flaggedListings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all listings (admin only - populated with reports)
// @route   GET /api/admin/listings
// @access  Private/Admin
const getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find({})
            .populate('postedBy', 'name email')
            .populate('reports.reportedBy', 'name email');
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete listing (admin force delete)
// @route   DELETE /api/admin/listings/:id
// @access  Private/Admin
const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (listing) {
            await listing.deleteOne();
            res.json({ message: 'Listing removed' });
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unflag a listing
// @route   PUT /api/admin/listings/:id/unflag
// @access  Private/Admin
const unflagListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (listing) {
            listing.isFlagged = false;
            await listing.save();
            res.json({ message: 'Listing unflagged successfully' });
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Dismiss a specific listing report
// @route   DELETE /api/admin/listings/:listingId/reports/:reportId
// @access  Private/Admin
const dismissListingReport = async (req, res) => {
    try {
        const { listingId, reportId } = req.params;
        const listing = await Listing.findById(listingId);

        if (listing) {
            const initialLength = listing.reports.length;
            listing.reports = listing.reports.filter(report => report._id.toString() !== reportId);

            if (listing.reports.length === initialLength) {
                return res.status(404).json({ message: 'Report not found' });
            }

            // If no reports left, unflag it automatically
            if (listing.reports.length === 0) {
                listing.isFlagged = false;
            }

            await listing.save();
            res.json({ message: 'Report dismissed successfully' });
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
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
    getAdminStats,
    getAllListings,
    deleteListing,
    unflagListing,
    dismissListingReport
};
