const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');

// @route   POST /api/lists
// @desc    Create a new list
// @access  Private
router.post('/', [
  auth,
  body('title').trim().notEmpty().withMessage('List title is required'),
  body('boardId').notEmpty().withMessage('Board ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, boardId } = req.body;

    // Check if board exists and user has access
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.owner.toString() !== req.user._id.toString() &&
        !board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get position for new list
    const listsCount = await List.countDocuments({ boardId });

    const list = new List({
      title,
      boardId,
      position: listsCount
    });

    await list.save();

    // Add list to board
    board.lists.push(list._id);
    await board.save();

    res.status(201).json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/lists/:id
// @desc    Update a list
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title } = req.body;

    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Check if user has access to the board
    const board = await Board.findById(list.boardId);
    if (board.owner.toString() !== req.user._id.toString() &&
        !board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    list.title = title || list.title;
    await list.save();

    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/lists/:id
// @desc    Delete a list
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Check if user has access to the board
    const board = await Board.findById(list.boardId);
    if (board.owner.toString() !== req.user._id.toString() &&
        !board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete all cards in the list
    await Card.deleteMany({ listId: list._id });

    // Remove list from board
    board.lists = board.lists.filter(listId => listId.toString() !== list._id.toString());
    await board.save();

    await list.deleteOne();

    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
