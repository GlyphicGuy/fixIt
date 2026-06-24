const Listing = require('../models/Listing');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const { category, status, search } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const listings = await Listing.find(query)
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('postedBy', 'name email photoUrl')
      .populate('acceptedFixer', 'name email photoUrl skills')
      .populate('interestedFixers.fixer', 'name email photoUrl rating fixesCompleted skills badges');

    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
  try {
    const { title, description, category, photoUrl } = req.body;

    const listing = await Listing.create({
      title,
      description,
      category,
      photoUrl,
      postedBy: req.user._id
    });

    const populatedListing = await Listing.findById(listing._id)
      .populate('postedBy', 'name email photoUrl');

    res.status(201).json(populatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, description, category, photoUrl, status } = req.body;

    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.category = category || listing.category;
    listing.photoUrl = photoUrl || listing.photoUrl;
    listing.status = status || listing.status;

    const updatedListing = await listing.save();

    const populatedListing = await Listing.findById(updatedListing._id)
      .populate('postedBy', 'name email photoUrl');

    res.json(populatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await listing.deleteOne();

    res.json({ message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add interested fixer to listing
// @route   POST /api/listings/:id/interest
// @access  Private
const addInterestedFixer = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is trying to express interest in their own listing
    if (listing.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot express interest in your own listing' });
    }

    // Check if already interested
    const alreadyInterested = listing.interestedFixers.find(
      item => item.fixer.toString() === req.user._id.toString()
    );

    if (alreadyInterested) {
      return res.status(400).json({ message: 'Already expressed interest' });
    }

    listing.interestedFixers.push({
      fixer: req.user._id,
      message: req.body.message || '',
      proposedPrice: req.body.proposedPrice || 0
    });

    await listing.save();

    const updatedListing = await Listing.findById(listing._id)
      .populate('postedBy', 'name email photoUrl')
      .populate('interestedFixers.fixer', 'name email photoUrl rating fixesCompleted skills badges');

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's listings
// @route   GET /api/listings/user/:userId
// @access  Public
const getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ postedBy: req.params.userId })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get listings where user expressed interest
// @route   GET /api/listings/interested/:userId
// @access  Public
const getInterestedListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      'interestedFixers.fixer': req.params.userId
    })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    // Map listings to include the user's interest status
    const listingsWithStatus = listings.map(listing => {
      const userInterest = listing.interestedFixers.find(
        item => item.fixer._id.toString() === req.params.userId
      );
      return {
        ...listing.toObject(),
        userInterestStatus: userInterest?.status || 'pending',
        userInterestMessage: userInterest?.message || '',
        userInterestDate: userInterest?.createdAt,
        userProposedPrice: userInterest?.proposedPrice || 0
      };
    });

    res.json(listingsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept a fixer for a listing
// @route   POST /api/listings/:id/accept/:fixerId
// @access  Private (only listing poster)
const acceptFixer = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized - only poster can accept fixers' });
    }

    // Find the interested fixer
    const interestedFixer = listing.interestedFixers.find(
      item => item.fixer.toString() === req.params.fixerId
    );

    if (!interestedFixer) {
      return res.status(404).json({ message: 'Fixer not found in interested list' });
    }

    // Update the fixer's status to accepted
    interestedFixer.status = 'accepted';

    // Set the accepted fixer
    listing.acceptedFixer = req.params.fixerId;

    // Mark all other interested fixers as rejected
    listing.interestedFixers.forEach(item => {
      if (item.fixer.toString() !== req.params.fixerId && item.status === 'pending') {
        item.status = 'rejected';
      }
    });

    await listing.save();

    const updatedListing = await Listing.findById(listing._id)
      .populate('postedBy', 'name email photoUrl')
      .populate('acceptedFixer', 'name email photoUrl skills')
      .populate('interestedFixers.fixer', 'name email photoUrl rating fixesCompleted skills badges');

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark listing as fixed and optionally rate fixer
// @route   POST /api/listings/:id/mark-fixed
// @access  Private (only listing poster)
const markListingFixed = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized - only poster can close listings' });
    }

    // Mark as fixed
    listing.status = 'fixed';
    await listing.save();

    // If rating is provided and there's an accepted fixer, update their rating
    const { rating, fixerId } = req.body;
    if (rating && fixerId) {
      const User = require('../models/User');
      const fixer = await User.findById(fixerId);

      if (fixer) {
        // Calculate new rating (weighted average)
        const totalRatings = fixer.fixesCompleted || 0;
        const currentRating = fixer.rating || 0;
        const newRating = ((currentRating * totalRatings) + rating) / (totalRatings + 1);

        fixer.rating = newRating;
        fixer.fixesCompleted = totalRatings + 1;
        await fixer.save();
      }
    }

    const updatedListing = await Listing.findById(listing._id)
      .populate('postedBy', 'name email photoUrl')
      .populate('acceptedFixer', 'name email photoUrl skills rating fixesCompleted')
      .populate('interestedFixers.fixer', 'name email photoUrl rating fixesCompleted skills badges');

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Flag a listing
// @route   PUT /api/listings/:id/flag
// @access  Private
const flagListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' });
    }

    // Check if user has already reported this listing
    const alreadyReported = listing.reports.find(
      (r) => r.reportedBy.toString() === req.user._id.toString()
    );

    if (alreadyReported) {
      return res.status(400).json({ message: 'You have already reported this listing' });
    }

    const newReport = {
      reason,
      reportedBy: req.user._id
    };

    listing.reports.push(newReport);
    listing.isFlagged = true;

    await listing.save();

    res.json({ message: 'Listing reported successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public stats for home page
// @route   GET /api/listings/stats
// @access  Public
const getPublicStats = async (req, res) => {
  try {
    const User = require('../models/User');

    const itemsFixed = await Listing.countDocuments({ status: 'fixed' });
    const activeFixers = await User.countDocuments({
      skills: { $exists: true, $not: { $size: 0 } }
    });

    const usersWithRatings = await User.find({ rating: { $gt: 0 } }).select('rating');
    const avgRating = usersWithRatings.length > 0
      ? (usersWithRatings.reduce((sum, user) => sum + user.rating, 0) / usersWithRatings.length)
      : 0;

    const wasteReduced = itemsFixed * 8;

    res.json({
      itemsFixed,
      activeFixers,
      avgRating: avgRating.toFixed(1),
      wasteReduced
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
  getPublicStats
};
acceptFixer,
  markListingFixed,
  flagListing,
  getPublicStats,
  getListingPhoto
};
