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
      .populate('postedBy', 'name email photoUrl')
      .populate('interestedFixers.fixer', 'name email photoUrl rating fixesCompleted')
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
    
    // Check if already interested
    const alreadyInterested = listing.interestedFixers.find(
      item => item.fixer.toString() === req.user._id.toString()
    );
    
    if (alreadyInterested) {
      return res.status(400).json({ message: 'Already expressed interest' });
    }
    
    listing.interestedFixers.push({
      fixer: req.user._id,
      message: req.body.message || ''
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
      .populate('postedBy', 'name email photoUrl')
      .sort({ createdAt: -1 });
    
    res.json(listings);
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
  getUserListings
};
