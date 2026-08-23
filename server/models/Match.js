const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skillOffered: { type: String, required: true },
    skillWanted: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillListing' },
    // TTL field: pending matches auto-delete after 3 days.
    // Set to null when a match is accepted/rejected to prevent deletion.
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      index: { expires: 0 }, // MongoDB TTL index: delete document when expiresAt is reached
    },
    // Notification tracking: has the 1-day-warning notification been sent?
    expiryNotified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
