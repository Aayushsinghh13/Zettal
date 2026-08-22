require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const matchRoutes = require('./routes/matchRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/matches', matchRoutes);

app.get('/', (req, res) => {
  res.send('Skill Swap API is running');
});

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to database');
    app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
  })
  .catch((err) => {
    console.log('DB connection error', err);
  });
