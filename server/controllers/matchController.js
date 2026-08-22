const Match = require('../models/Match');

exports.sendMatchRequest = async (req, res) => {
  try {
    const { receiverId, skillOffered, skillWanted, listingId } = req.body;

    if (req.user.id === receiverId) {
      return res.status(400).json({ message: 'You cannot send a match request to yourself' });
    }

    const existingMatch = await Match.findOne({
      sender: req.user.id,
      receiver: receiverId,
      status: 'pending',
    });

    if (existingMatch) {
      return res.status(400).json({ message: 'Match request already sent' });
    }

    const match = await Match.create({
      sender: req.user.id,
      receiver: receiverId,
      skillOffered,
      skillWanted,
      listing: listingId,
    });

    res.status(201).json(match);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate('sender', 'name avatar skillsOffered')
      .populate('receiver', 'name avatar skillsOffered')
      .populate('listing', 'title skillName')
      .sort('-createdAt');

    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (match.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this match' });
    }

    if (match.status !== 'pending') {
      return res.status(400).json({ message: 'Match already responded to' });
    }

    match.status = status;
    await match.save();

    res.status(200).json(match);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (match.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this match' });
    }

    await Match.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Match request cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
