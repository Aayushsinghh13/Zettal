const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, googleAuth, registerValidation, loginValidation } = require('../controllers/authController');

// Rate limiter: max 10 auth attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, registerValidation, register);
router.post('/login',    authLimiter, loginValidation,    login);
router.post('/google',   authLimiter, googleAuth);

module.exports = router;