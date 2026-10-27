const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Travel', 'Bills', 'Shopping', 'Other']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);