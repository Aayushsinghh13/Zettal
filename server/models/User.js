const mongoose = require('mongoose');

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String }, // Optional for Google OAuth users
    googleId: { type: String, sparse: true, unique: true },
    bio: { type: String, default: '', maxlength: 300 },
    avatar: { type: String, default: '' },
    // Skills now stored as objects with name + proficiency level
    skillsOffered: [
      {
        name: { type: String, required: true, trim: true },
        level: { type: String, enum: LEVELS, default: 'Beginner' },
      },
    ],
    location: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    // In-app notifications array (latest first)
    notifications: [
      {
        message: { type: String, required: true },
        link: { type: String, default: '/matches' },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
