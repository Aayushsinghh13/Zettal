const SkillListing = require('../models/SkillListing');

exports.createListing = async (req, res) => {
  try {
    const { title, description, category, skillName, proficiencyWanted } = req.body;
    const listing = await SkillListing.create({
      title, description, category, skillName,
      proficiencyWanted: proficiencyWanted || 'Beginner',
      postedBy: req.user.id,
    });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getAllListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { category, skill } = req.query;

    let query = { isActive: true };
    if (category) query.category = { $regex: category, $options: 'i' };
    if (skill) query.skillName = { $regex: skill, $options: 'i' };

    const listings = await SkillListing.find(query)
      .skip(offset)
      .limit(limit)
      .populate('postedBy', 'name avatar location rating')
      .sort('-createdAt');

    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await SkillListing.findById(req.params.id)
      .populate('postedBy', 'name avatar location rating');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await SkillListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const { title, description, category, skillName, isActive } = req.body;

    const updatedListing = await SkillListing.findByIdAndUpdate(
      req.params.id,
      { title, description, category, skillName, isActive },
      { new: true, runValidators: true }
    ).populate('postedBy', 'name avatar location rating');

    res.status(200).json(updatedListing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await SkillListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await SkillListing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};