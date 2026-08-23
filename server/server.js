require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');           // Node's built-in HTTP module
const { Server } = require('socket.io'); // Socket.io
const cron = require('node-cron');       // For scheduled tasks

const Message = require('./models/Message'); // needed to save messages from socket
const Match = require('./models/Match');     // needed to authorize socket users
const User = require('./models/User');       // needed to push notifications

const app = express();

// -----------------------------------------------------------------
// Why create an HTTP server manually?
// Express normally creates one internally with app.listen().
// But Socket.io must attach to the SAME HTTP server as Express.
// So we create it explicitly, attach both Express and Socket.io to it.
// -----------------------------------------------------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // In production, replace with your frontend URL
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const matchRoutes = require('./routes/matchRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);

// Inject Socket.io instance into matchController for real-time notifications
const matchController = require('./controllers/matchController');
matchController.setIo(io);

app.get('/', (req, res) => res.send('Skill Swap API is running'));

// -----------------------------------------------------------------
// SOCKET.IO — Real-Time Event Handlers
// io.on('connection') fires every time a new client connects.
// 'socket' represents that one specific connected client.
// -----------------------------------------------------------------
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // ---------------------------------------------------------------
  // Event: join-room
  // The client fires this immediately after opening the chat page.
  // We put the socket into a "room" named by the matchId.
  // A room is just a named channel — only sockets in the same room
  // receive events broadcast to that room.
  // ---------------------------------------------------------------
  socket.on('join-room', (matchId) => {
    socket.join(matchId);
    console.log(`Socket ${socket.id} joined room: ${matchId}`);
  });

  // ---------------------------------------------------------------
  // Event: join-user-room
  // Each logged-in user joins a personal room keyed by their userId.
  // This allows us to push real-time notifications directly to them
  // without broadcasting to unrelated users.
  // ---------------------------------------------------------------
  socket.on('join-user-room', (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined personal room: ${userId}`);
  });

  // ---------------------------------------------------------------
  // Event: typing
  // Broadcast to other participants in the room that someone is typing.
  // ---------------------------------------------------------------
  socket.on('typing', ({ matchId, userId, name }) => {
    socket.to(matchId).emit('user-typing', { userId, name });
  });

  // ---------------------------------------------------------------
  // Event: send-message
  // The client fires this when the user clicks "Send".
  // We receive the data, save it to MongoDB, then broadcast it
  // back to everyone in the room (including the sender).
  // ---------------------------------------------------------------
  socket.on('send-message', async (data) => {
    // data = { matchId, senderId, text }
    try {
      const { matchId, senderId, text } = data;

      // Authorization: verify user belongs to this match
      const match = await Match.findById(matchId);
      if (!match) return;

      const isParticipant =
        match.sender.toString() === senderId ||
        match.receiver.toString() === senderId;

      if (!isParticipant || match.status !== 'accepted') return;

      // Save the message to the database
      const message = await Message.create({ matchId, sender: senderId, text });

      // Populate sender info before broadcasting
      const populated = await message.populate('sender', 'name avatar');

      // Broadcast to everyone in the chat room (both participants)
      io.to(matchId).emit('receive-message', populated);

      // ── Real-time message notification ─────────────────────────
      // Determine the OTHER participant (the recipient)
      const recipientId = match.sender.toString() === senderId
        ? match.receiver.toString()
        : match.sender.toString();

      const senderName = populated.sender?.name || 'Someone';
      const preview    = text.length > 50 ? text.slice(0, 50) + '…' : text;

      // Persist notification to DB
      const notif = {
        message: `💬 ${senderName}: "${preview}"`,
        link: '/messages',
        read: false,
        createdAt: new Date(),
      };
      await User.findByIdAndUpdate(recipientId, {
        $push: {
          notifications: {
            $each: [notif],
            $position: 0,
            $slice: 20,
          },
        },
      });

      // Emit to recipient's personal room (instantly — no refresh needed)
      io.to(recipientId).emit('notification', notif);

    } catch (err) {
      console.error('Socket send-message error:', err.message);
    }
  });


  // ---------------------------------------------------------------
  // Event: disconnect
  // Fires automatically when a user closes the tab or loses network.
  // Socket.io automatically removes the socket from all rooms.
  // ---------------------------------------------------------------
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// -----------------------------------------------------------------
// CRON JOB: Send expiry-warning notifications daily at midnight.
// Finds pending matches expiring within the next 24 hours that
// haven't been notified yet, then pushes an in-app alert to both
// the sender and receiver.
// -----------------------------------------------------------------
cron.schedule('0 0 * * *', async () => {
  console.log('[CRON] Running match expiry notification job...');
  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find pending matches expiring in the next 24 hours that haven't been notified
    const expiringMatches = await Match.find({
      status: 'pending',
      expiresAt: { $lte: in24h, $gt: now },
      expiryNotified: false,
    }).populate('sender', 'name').populate('receiver', 'name');

    for (const match of expiringMatches) {
      const pushNotif = async (userId, otherName) => {
        await User.findByIdAndUpdate(userId, {
          $push: {
            notifications: {
              $each: [{
                message: `⏳ Your swap request with ${otherName} expires in less than 24 hours!`,
                link: '/matches',
              }],
              $position: 0,
              $slice: 20,
            },
          },
        });
      };

      await pushNotif(match.sender._id, match.receiver.name);
      await pushNotif(match.receiver._id, match.sender.name);

      // Mark as notified so we don't send it again
      match.expiryNotified = true;
      await match.save();
    }

    console.log(`[CRON] Notified ${expiringMatches.length} expiring matches.`);
  } catch (err) {
    console.error('[CRON] Error in expiry notification job:', err.message);
  }
});

// -----------------------------------------------------------------
// Use server.listen instead of app.listen
// This starts BOTH the Express HTTP server AND the Socket.io server
// on the same port.
// -----------------------------------------------------------------
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to database');
    server.listen(PORT, () => console.log(`Server is running at ${PORT}`));
  })
  .catch((err) => {
    console.log('DB connection error', err);
  });
