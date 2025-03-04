const express = require('express');
const Todo = require('../models/Todo');

const router = express.Router();

// Create a new to-do item
router.post('/', async (req, res) => {
    try {
        const newTodo = new Todo({
            title: req.body.title,
        });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all to-do items
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a to-do item
router.put('/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a to-do item
router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'To-Do item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
