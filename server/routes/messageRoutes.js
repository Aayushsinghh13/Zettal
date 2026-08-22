const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/', auth, sendMessage);
router.get('/:matchId', auth, getMessages);

module.exports = router;
