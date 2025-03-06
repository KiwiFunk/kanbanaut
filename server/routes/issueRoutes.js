const express = require('express');
const Issue = require('../models/Issue');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Create a new issue 
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { title, body, column, projectId } = req.body;
        
        // Validate required fields
        if (!title || !column || !projectId) {
            return res.status(400).json({ message: 'Title, column, and projectId are required' });
        }

        // Get the last issue in the column for ordering
        const lastIssue = await Issue.findOne({
            column,
            project: projectId
        }).sort({ order: -1 });

        const newIssue = new Issue({
            title,
            body,
            userId: req.user.userId,
            project: projectId,
            column,
            order: lastIssue ? lastIssue.order + 1 : 0
        });

        const savedIssue = await newIssue.save();
        res.status(201).json(savedIssue);
    } catch (err) {
        console.error('Error creating issue:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get all issues for a specific project
router.get('/:projectId', authenticateUser, async (req, res) => {
    try {
        const issues = await Issue.find({ 
            userId: req.user.userId,
            project: req.params.projectId
        }).sort({ order: 1 });
        
        if (!issues) {
            return res.status(404).json({ message: 'No issues found for this project' });
        }
        
        res.json(issues);
    } catch (err) {
        console.error('Error fetching issues:', err);
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