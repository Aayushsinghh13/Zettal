require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');           // Node's built-in HTTP module
const { Server } = require('socket.io'); // Socket.io

const Message = require('./models/Message'); // needed to save messages from socket
const Match = require('./models/Match');     // needed to authorize socket users

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

app.get('/', (req, res) => {
  res.send('Skill Swap API is running');
});

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

      // Broadcast to everyone in the room
      // io.to(room).emit() sends to ALL sockets in the room
      io.to(matchId).emit('receive-message', populated);

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
