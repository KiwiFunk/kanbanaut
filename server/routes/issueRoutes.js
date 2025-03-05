const express = require('express');
const Issue = require('../models/Issue');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Create a new issue 
router.post('/', authenticateUser, async (req, res) => {
    try {
        const newIssue = new Issue({
            title: req.body.title,
            body: req.body.body,
            userId: req.user.userId, // Link to the logged-in user
        });
        const savedIssue = await newIssue.save();
        res.status(201).json(savedIssue);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all the issues for the user sending the request
router.get('/', authenticateUser, async (req, res) => {
    try {
        const issues = await Issue.find({ userId: req.user.userId });       // Only fetch the current user's Issue
        res.json(issues);                                                   // Send JSON response containing all issue objects
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update an issue
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const updatedIssue = await Issue.findOneAndUpdate(       
            { _id: req.params.id, userId: req.user.userId },                // Ensure the user owns the issue and the issue exists
            { $set: req.body },                                             // Update the issue with the request body
            { new: true }                                                   // Ensure the updated issue is returned
        );
        if (!updatedIssue) {                                                // If the issue is not found
            return res.status(404).json({ message: 'Issue not found' });
        }
        res.json(updatedIssue);
    } catch (err) {                                                         
        res.status(500).json({ message: err.message });
    }
});


// Delete an issue
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const deletedIssue = await Issue.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId,                                        // Ensure the user owns the issue
        });
        if (!deletedIssue) {
            return res.status(404).json({ message: 'Issue not found' });
        }
        res.json({ message: 'Issue deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;