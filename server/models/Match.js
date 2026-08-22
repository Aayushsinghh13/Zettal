const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skillOffered: { type: String, required: true },
    skillWanted: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillListing', required: true },
  },
  { timestamps: true }
);

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
