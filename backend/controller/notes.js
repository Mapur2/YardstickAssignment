const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const Tenant = require('../models/Tenant');

// Create a new note
const createNote = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Check subscription limits
    const currentNoteCount = await Note.countDocuments({ tenant: req.user.tenant._id });
    const canCreateNote = req.tenant.canCreateNote(currentNoteCount);

    if (!canCreateNote) {
      return res.status(403).json({
        error: 'Subscription limit reached',
        message: `Free plan is limited to ${req.tenant.subscription.noteLimit} notes. Please upgrade to Pro for unlimited notes.`,
        currentCount: currentNoteCount,
        limit: req.tenant.subscription.noteLimit
      });
    }

    const { title, content, tags = [] } = req.body;

    const note = new Note({
      title,
      content,
      tags,
      tenant: req.user.tenant._id,
      author: req.user._id
    });

    await note.save();
    await note.populate('author', 'email role');

    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create note'
    });
  }
};

// Get all notes for the current tenant
const getNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, archived = false } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      ...req.tenantFilter,
      isArchived: archived === 'true'
    };

    const notes = await Note.find(query)
      .populate('author', 'email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve notes'
    });
  }
};

// Get a specific note
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      ...req.tenantFilter
    }).populate('author', 'email role');

    if (!note) {
      return res.status(404).json({
        error: 'Note not found',
        message: 'Note does not exist or you do not have access to it'
      });
    }

    res.json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve note'
    });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      ...req.tenantFilter
    });

    if (!note) {
      return res.status(404).json({
        error: 'Note not found',
        message: 'Note does not exist or you do not have access to it'
      });
    }

    // Update fields
    const { title, content, tags } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;

    await note.save();
    await note.populate('author', 'email role');

    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update note'
    });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      ...req.tenantFilter
    });

    if (!note) {
      return res.status(404).json({
        error: 'Note not found',
        message: 'Note does not exist or you do not have access to it'
      });
    }

    res.json({
      message: 'Note deleted successfully',
      note: {
        id: note._id,
        title: note.title
      }
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete note'
    });
  }
};

// Archive/Unarchive a note
const archiveNote = async (req, res) => {
  try {
    const { archived = true } = req.body;
    
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        ...req.tenantFilter
      },
      { isArchived: archived },
      { new: true }
    ).populate('author', 'email role');

    if (!note) {
      return res.status(404).json({
        error: 'Note not found',
        message: 'Note does not exist or you do not have access to it'
      });
    }

    res.json({
      message: `Note ${archived ? 'archived' : 'unarchived'} successfully`,
      note
    });
  } catch (error) {
    console.error('Archive note error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to archive note'
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  archiveNote
};
