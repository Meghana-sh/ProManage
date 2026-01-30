const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Board = require('../models/Board');
const List = require('../models/List');

// @route   GET /api/boards
// @desc    Get all boards for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    }).populate('owner', 'username email').sort({ createdAt: -1 });

    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/boards/:id
// @desc    Get single board with lists and cards
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('owner', 'username email')
      .populate({
        path: 'lists',
        populate: {
          path: 'cards',
          options: { sort: { position: 1 } }
        },
        options: { sort: { position: 1 } }
      });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user has access to board
    if (board.owner._id.toString() !== req.user._id.toString() &&
        !board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/boards
// @desc    Create a new board
// @access  Private
router.post('/', [
  auth,
  body('title').trim().notEmpty().withMessage('Board title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    const board = new Board({
      title,
      description,
      owner: req.user._id,
      members: [req.user._id]
    });

    await board.save();
    await board.populate('owner', 'username email');

    res.status(201).json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/boards/:id
// @desc    Update a board
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    let board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user is owner
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    board.title = title || board.title;
    board.description = description !== undefined ? description : board.description;

    await board.save();
    await board.populate('owner', 'username email');

    res.json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/boards/:id
// @desc    Delete a board
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user is owner
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all lists and cards associated with the board
    await List.deleteMany({ boardId: board._id });

    await board.deleteOne();

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
