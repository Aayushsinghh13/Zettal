const Match = require('../models/Match');
const User = require('../models/User');

// io is injected from server.js so we can emit real-time notifications
let _io = null;
exports.setIo = (io) => { _io = io; };

// Helper: save notification to DB + emit real-time event to the user's personal socket room
const notify = async (userId, message, link = '/matches') => {
  const notif = { message, link, read: false, createdAt: new Date() };

  // Persist to DB
  await User.findByIdAndUpdate(userId, {
    $push: {
      notifications: {
        $each: [notif],
        $position: 0,   // newest first
        $slice: 20,     // keep max 20
      },
    },
  });

  // Emit real-time to user's personal room (userId string)
  if (_io) {
    _io.to(userId.toString()).emit('notification', notif);
  }
};

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

    // Notify the receiver in real-time
    const sender = await User.findById(req.user.id).select('name');
    await notify(
      receiverId,
      `🔔 ${sender.name} sent you a swap request! They offer "${skillOffered}" and want "${skillWanted}". You have 3 days to respond.`,
      '/matches'
    );

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

    // Use $set + $unset in one atomic update to avoid the TTL field being saved as null
    const updated = await Match.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status },
        $unset: { expiresAt: '' }, // properly remove the TTL field so MongoDB won't auto-delete
      },
      { new: true, runValidators: false }
    );

    // Notify the original sender in real-time
    const receiver = await User.findById(req.user.id).select('name');
    const notifMsg = status === 'accepted'
      ? `✅ ${receiver.name} accepted your swap request! Open the chat to get started.`
      : `❌ ${receiver.name} declined your swap request.`;
    await notify(match.sender, notifMsg, '/matches');

    res.status(200).json(updated);
  } catch (err) {
    console.error('[updateMatchStatus] Error:', err.message);
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
