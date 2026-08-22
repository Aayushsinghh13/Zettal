const express = require('express');
const router = express.Router();
const { createListing, getAllListings, getListingById, updateListing, deleteListing } = require('../controllers/skillController');
const auth = require('../middleware/auth');

router.post('/', auth, createListing);
router.get('/', getAllListings);
router.get('/:id', getListingById);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);

module.exports = router;