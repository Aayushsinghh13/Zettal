const express = require('express');
const router = express.Router();
// Import the whole module (not destructured) so we always call the live exports
const matchController = require('../controllers/matchController');
const auth = require('../middleware/auth');

router.post('/',    auth, (req, res) => matchController.sendMatchRequest(req, res));
router.get('/',     auth, (req, res) => matchController.getMyMatches(req, res));
router.put('/:id',  auth, (req, res) => matchController.updateMatchStatus(req, res));
router.delete('/:id', auth, (req, res) => matchController.deleteMatch(req, res));

module.exports = router;
