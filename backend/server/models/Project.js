const mongoose = require('mongoose');

// Project Schema
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  liveLink: {
    type: String,
    default: ''
  },
  githubLink: {
    type: String,
    default: ''
  },
  technologies: {
    type: [String],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
