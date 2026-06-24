const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl,
        skills: user.skills,
        badges: user.badges,
        rating: user.rating,
        fixesCompleted: user.fixesCompleted,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl,
        skills: user.skills,
        badges: user.badges,
        rating: user.rating,
        fixesCompleted: user.fixesCompleted,
        bio: user.bio,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // Handle photo URL update (can be regular URL or base64)
      if (req.body.photoUrl) {
        const photoUrl = req.body.photoUrl;
        const photoSize = (photoUrl.length / (1024 * 1024)).toFixed(2);
        console.log(`Received photo URL. Size: ${photoSize} MB`);

        // Basic validation: check if it's a data URL (base64) or regular URL
        const isDataUrl = photoUrl.startsWith('data:image/');
        const isRegularUrl = photoUrl.startsWith('http://') || photoUrl.startsWith('https://');

        if (isDataUrl || isRegularUrl) {
          console.log(`Photo URL validation passed. Type: ${isDataUrl ? 'base64' : 'regular URL'}`);
          user.photoUrl = photoUrl;
        } else {
          console.log('Photo URL validation failed');
          return res.status(400).json({ message: 'Invalid photo URL format' });
        }
      }

      user.skills = req.body.skills || user.skills;
      user.bio = req.body.bio || user.bio;

      console.log('Saving user profile...');
      const updatedUser = await user.save();
      console.log('User profile saved successfully');

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        photoUrl: updatedUser.photoUrl,
        skills: updatedUser.skills,
        badges: updatedUser.badges,
        rating: updatedUser.rating,
        fixesCompleted: updatedUser.fixesCompleted,
        bio: updatedUser.bio
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all fixers
// @route   GET /api/users/fixers
// @access  Public
const getFixers = async (req, res) => {
  try {
    const fixers = await User.find({
      skills: { $exists: true, $not: { $size: 0 } }
    }).select('-password');

    res.json(fixers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Report a user
// @route   POST /api/users/:id/report
// @access  Private
const reportUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-reporting
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot report yourself' });
    }

    // Add report
    const newReport = {
      reporter: req.user._id,
      reason,
      createdAt: Date.now()
    };

    user.reports.push(newReport);
    await user.save();

    res.status(201).json({ message: 'User reported successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getFixers,
  reportUser
};
