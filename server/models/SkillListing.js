const mongoose = require('mongoose');

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const skillListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, maxlength: 500 },
    category: { type: String, required: true, trim: true },
    skillName: { type: String, required: true, trim: true },
    // What proficiency level is the poster looking for from their swap partner?
    proficiencyWanted: { type: String, enum: LEVELS, default: 'Beginner' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SkillListing = mongoose.model('SkillListing', skillListingSchema);
module.exports = SkillListing;
