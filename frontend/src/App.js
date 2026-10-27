import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://expense-tracker-backend.vercel.app/api/expenses';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(API_URL);
      setExpenses(response.data);
    } catch (error) {
      showMessage('Failed to fetch expenses from server.', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, category, date } = formData;

    if (!title.trim() || !amount || !category || !date) {
      showMessage('Please fill in all fields.', 'error');
      return;
    }

    if (Number(amount) <= 0) {
      showMessage('Amount must be greater than zero.', 'error');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        showMessage('Expense updated successfully!', 'success');
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
        showMessage('Expense added successfully!', 'success');
      }

      setFormData({ title: '', amount: '', category: 'Food', date: '' });
      fetchExpenses();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error saving expense.', 'error');
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.split('T')[0]
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', amount: '', category: 'Food', date: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        showMessage('Expense deleted successfully!', 'success');
        fetchExpenses();
      } catch (error) {
        showMessage('Failed to delete expense.', 'error');
      }
    }
  };

  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="container">
      <header>
        <h1>Personal Expense Tracker</h1>
      </header>

      <div className="summary-card">
        <h2>Total Amount Spent</h2>
        <p>${totalAmount.toFixed(2)}</p>
      </div>

      <br />

      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <h3>{editingId ? 'Edit Expense' : 'Add New Expense'}</h3>
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Grocery Shopping"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="btn-container">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Expense' : 'Add Expense'}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Expense History</h3>
        {expenses.length === 0 ? (
          <p>No expenses recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.title}</td>
                    <td>${Number(expense.amount).toFixed(2)}</td>
                    <td>{expense.category}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(expense)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(expense._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;