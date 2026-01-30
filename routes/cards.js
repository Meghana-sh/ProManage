const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');

// @route   POST /api/cards
// @desc    Create a new card
// @access  Private
router.post('/', [
  auth,
  body('title').trim().notEmpty().withMessage('Card title is required'),
  body('listId').notEmpty().withMessage('List ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, listId } = req.body;

    // Check if list exists and user has access
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    const board = await Board.findById(list.boardId);
    if (board.owner.toString() !== req.user._id.toString() &&
        !board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get position for new card
    const cardsCount = await Card.countDocuments({ listId });

    const card = new Card({
      title,
      description,
      listId,
      position: cardsCount
    });

    await card.save();

    // Add card to list
    list.cards.push(card._id);
    await list.save();

    res.status(201).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cards/:id
// @desc    Update a card
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Check if user has access
    const list = await List.findById(card.listId);
    const board = await Board.findById(list.boardId);
    if (board.owner.toString() !== req.user._id.toString() &&
        !board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    card.title = title || card.title;
    card.description = description !== undefined ? description : card.description;
    await card.save();

    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cards/:id/move
// @desc    Move a card (drag and drop)
// @access  Private
router.put('/:id/move', auth, async (req, res) => {
  try {
    const { sourceListId, destinationListId, sourceIndex, destinationIndex } = req.body;

    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Check access
    const sourceList = await List.findById(sourceListId);
    const board = await Board.findById(sourceList.boardId);
    if (board.owner.toString() !== req.user._id.toString() &&
        !board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Moving within same list
    if (sourceListId === destinationListId) {
      const cards = await Card.find({ listId: sourceListId }).sort({ position: 1 });
      
      // Remove from source position
      const [movedCard] = cards.splice(sourceIndex, 1);
      // Insert at destination position
      cards.splice(destinationIndex, 0, movedCard);

      // Update positions
      for (let i = 0; i < cards.length; i++) {
        cards[i].position = i;
        await cards[i].save();
      }
    } else {
      // Moving to different list
      const sourceCards = await Card.find({ listId: sourceListId }).sort({ position: 1 });
      const destCards = await Card.find({ listId: destinationListId }).sort({ position: 1 });

      // Remove from source
      sourceCards.splice(sourceIndex, 1);
      
      // Update source cards positions
      for (let i = 0; i < sourceCards.length; i++) {
        sourceCards[i].position = i;
        await sourceCards[i].save();
      }

      // Update card's listId
      card.listId = destinationListId;
      
      // Insert at destination
      destCards.splice(destinationIndex, 0, card);

      // Update destination cards positions
      for (let i = 0; i < destCards.length; i++) {
        destCards[i].position = i;
        await destCards[i].save();
      }

      // Update list references
      const sourceListObj = await List.findById(sourceListId);
      const destListObj = await List.findById(destinationListId);
      
      sourceListObj.cards = sourceListObj.cards.filter(id => id.toString() !== card._id.toString());
      destListObj.cards.push(card._id);
      
      await sourceListObj.save();
      await destListObj.save();
    }

    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cards/:id
// @desc    Delete a card
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Check access
    const list = await List.findById(card.listId);
    const board = await Board.findById(list.boardId);
    if (board.owner.toString() !== req.user._id.toString() &&
        !board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove card from list
    list.cards = list.cards.filter(cardId => cardId.toString() !== card._id.toString());
    await list.save();

    await card.deleteOne();

    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
