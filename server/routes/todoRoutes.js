const express = require('express');
const Todo = require('../models/Issue');
const authenticateUser = require('../middleware/auth');


const router = express.Router();

// Create a new to-do item
router.post('/', authenticateUser, async (req, res) => {
    try {
        const newTodo = new Todo({
            title: req.body.title,
            userId: req.user.userId, // Link to the logged-in user
        });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Get all to-do items
router.get('/', authenticateUser, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.userId }); // Only fetch user's to-dos
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update a to-do item
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId }, // Ensure the user owns the to-do
            { $set: req.body },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Delete a to-do item
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const deletedTodo = await Todo.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId, // Ensure the user owns the to-do
        });
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
