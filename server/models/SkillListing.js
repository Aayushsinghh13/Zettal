const mongoose = require('mongoose');

const skillListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, maxlength: 500 },
    category: { type: String, required: true, trim: true },
    skillName: { type: String, required: true, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SkillListing = mongoose.model('SkillListing', skillListingSchema);
module.exports = SkillListing;
