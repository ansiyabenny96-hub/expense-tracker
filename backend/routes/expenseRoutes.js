const express = require('express');
const router = express.Router();
const ExpenseModel = require('../models/Expense');

// GET: Fetch all records
router.get('/', async (request, response) => {
  try {
    const recordList = await ExpenseModel.find().sort({ date: -1 });
    response.status(200).json(recordList);
  } catch (error) {
    response.status(500).json({ message: 'Failed to retrieve database entries.' });
  }
});

// POST: Add a new entry
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
    response.status(400).json({ message: 'Invalid input data supplied.' });
  }
});

// PUT: Update an entry by ID
router.put('/:id', async (request, response) => {
  try {
    const updatedEntry = await ExpenseModel.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    
    if (!updatedEntry) {
      return response.status(404).json({ message: 'Record not found.' });
    }

    response.status(200).json(updatedEntry);
  } catch (error) {
    response.status(500).json({ message: 'Failed to update record.' });
  }
});

// DELETE: Remove an entry by ID
router.delete('/:id', async (request, response) => {
  try {
    await ExpenseModel.findByIdAndDelete(request.params.id);
    response.status(200).json({ message: 'Item removed successfully' });
  } catch (error) {
    response.status(500).json({ message: 'Unable to remove record.' });
  }
});

module.exports = router;