const express = require('express');
const { body } = require('express-validator');
const { authenticate, memberOrAdmin, tenantIsolation } = require('../middleware/auth');
const { createNote, getNotes, getNote, updateNote, deleteNote, archiveNote } = require('../controller/notes');

const router = express.Router();

// Apply authentication and tenant isolation to all routes
router.use(authenticate);
router.use(tenantIsolation);

// Create a new note
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('content').trim().isLength({ min: 1, max: 10000 }).withMessage('Content must be between 1 and 10000 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], memberOrAdmin, createNote);

// Get all notes for the current tenant
router.get('/', memberOrAdmin, getNotes);

// Get a specific note
router.get('/:id', memberOrAdmin, getNote);

// Update a note
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('content').optional().trim().isLength({ min: 1, max: 10000 }).withMessage('Content must be between 1 and 10000 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], memberOrAdmin, updateNote);

// Delete a note
router.delete('/:id', memberOrAdmin, deleteNote);

// Archive/Unarchive a note
router.patch('/:id/archive', memberOrAdmin, archiveNote);

module.exports = router;
