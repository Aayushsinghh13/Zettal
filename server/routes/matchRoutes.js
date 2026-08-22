const express = require('express');
const router = express.Router();
const { sendMatchRequest, getMyMatches, updateMatchStatus, deleteMatch } = require('../controllers/matchController');
const auth = require('../middleware/auth');

router.post('/', auth, sendMatchRequest);
router.get('/', auth, getMyMatches);
router.put('/:id', auth, updateMatchStatus);
router.delete('/:id', auth, deleteMatch);

module.exports = router;
