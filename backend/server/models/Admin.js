const mongoose = require('mongoose');
const crypto = require('crypto');

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  // Simple hash (in production, use bcrypt)
  this.password = crypto.createHash('sha256').update(this.password).digest('hex');
  next();
});

// Method to compare passwords
adminSchema.methods.comparePassword = function(candidatePassword) {
  const hashedCandidate = crypto.createHash('sha256').update(candidatePassword).digest('hex');
  return hashedCandidate === this.password;
};

module.exports = mongoose.model('Admin', adminSchema);
