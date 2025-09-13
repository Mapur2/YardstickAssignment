const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
noteSchema.index({ tenant: 1, createdAt: -1 });
noteSchema.index({ author: 1, createdAt: -1 });

// Virtual for formatted creation date
noteSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toISOString();
});

// Virtual for formatted updated date
noteSchema.virtual('formattedUpdatedAt').get(function() {
  return this.updatedAt.toISOString();
});

// Ensure virtual fields are serialized
noteSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Note', noteSchema);
