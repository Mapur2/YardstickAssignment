const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const { authenticate, verifyToken } = require('../middleware/auth');
const { login, profile } = require('../controller/auth');

const router = express.Router();

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], login);

// Get current user profile
router.get('/me', authenticate, profile);

// Verify token endpoint
router.get('/verify', authenticate, verifyToken);


module.exports = router;
