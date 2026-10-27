const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Configure CORS explicitly
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB Atlas
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('Database connection error:', err));
}

app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;