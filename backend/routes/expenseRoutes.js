const express = require('express');
const router = express.Router();
const ExpenseModel = require('../models/Expense');

// Retrieve all logged records
router.get('/', async (request, response) => {
  try {
    const recordList = await ExpenseModel.find().sort({ date: -1 });
    response.status(200).json(recordList);
  } catch (error) {
    response.status(500).json({ errorDetails: 'Failed to retrieve database entries.' });
  }
});

// Store a new entry
router.post('/', async (request, response) => {
  const { title, amount, category, date } = request.body;

  const newEntry = new ExpenseModel({
    title,
    amount,
    category,
    date
  });

  try {
    const savedEntry = await newEntry.save();
    response.status(201).json(savedEntry);
  } catch (error) {
    response.status(400).json({ errorDetails: 'Invalid input data supplied.' });
  }
});

// Remove single entry by identifier
router.delete('/:id', async (request, response) => {
  try {
    await ExpenseModel.findByIdAndDelete(request.params.id);
    response.status(200).json({ status: 'Item removed successfully' });
  } catch (error) {
    response.status(500).json({ errorDetails: 'Unable to remove requested record.' });
  }
});

module.exports = router;