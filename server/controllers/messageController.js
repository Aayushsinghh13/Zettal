const Message = require('../models/Message');
const Match = require('../models/Match');

exports.sendMessage = async (req, res) => {
  try {
    const { matchId, text } = req.body;
    const userId = req.user.id; // from auth middleware

    // 1. Check if the match exists
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // 2. Authorization Guard: Is the user part of this match?
    const isSender = match.sender.toString() === userId;
    const isReceiver = match.receiver.toString() === userId;
    
    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: 'You are not authorized to message in this match' });
    }

    // 3. Business Logic Guard: Is the match accepted?
    if (match.status !== 'accepted') {
      return res.status(400).json({ message: 'You can only message on accepted matches' });
    }

    // 4. Create and save the message
    const message = await Message.create({
      matchId,
      sender: userId,
      text
    });

    res.status(201).json(message);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;

    // 1. Verify match and authorization before returning messages
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const isSender = match.sender.toString() === userId;
    const isReceiver = match.receiver.toString() === userId;
    
    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: 'You are not authorized to view these messages' });
    }

    // 2. Fetch messages sorted by oldest first (standard chat view)
    const messages = await Message.find({ matchId })
      .populate('sender', 'name avatar') // attach sender's name so UI knows who sent it
      .sort('createdAt'); // Sort ascending (oldest to newest)

    res.status(200).json(messages);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
