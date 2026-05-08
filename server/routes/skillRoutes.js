const express = require("express");
const router = require("express").Router();
const {
  createListing,
  getAllListings,
  getListingsById,
  deleteListing,
} = require("../controllers/skillController.js");
const auth = require("../middleware/auth.js");

router.post('/',auth,createListing)
router.get('/',getAllListings)
router.get('/:id',getListingsById)
router.get('/:id',deleteListing)

module.exports = router;