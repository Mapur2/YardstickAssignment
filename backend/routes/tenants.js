const express = require('express');
const { body, validationResult } = require('express-validator');
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const Note = require('../models/Note');
const { authenticate, adminOnly, tenantIsolation } = require('../middleware/auth');
const { info, upgrade, stats, invite } = require('../controller/tenant.js');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Get tenant information
router.get('/info', tenantIsolation, info);

// Upgrade tenant to Pro plan
router.post('/:slug/upgrade', adminOnly, upgrade);

// Get tenant statistics (Admin only)
router.get('/stats', adminOnly, tenantIsolation, stats);

// Invite user (Admin only) - placeholder for future implementation
router.post('/invite', [
  body('email').isEmail().normalizeEmail(),
  body('role').isIn(['admin', 'member'])
], adminOnly, tenantIsolation, invite);

module.exports = router;
