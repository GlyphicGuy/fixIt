const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 1000
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Tech', 'Clothing', 'Furniture', 'Other']
  },
  photoUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'
  },
  status: {
    type: String,
    enum: ['open', 'fixed'],
    default: 'open'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interestedFixers: [{
    fixer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Listing', listingSchema);
