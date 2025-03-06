const express = require('express');
const authenticateUser = require('../middleware/auth');
const Column = require('../models/Column');

const router = express.Router();

// Send a POST request to create a new column
router.post('/', authenticateUser, async (req, res) => {
    try {

        // Handle logic in backend to prevent trusting client-side data validation

        //Get the last column in the project
        const lastColumn = await Column.findOne({ projectId })
            .sort({ order: -1 });

        const order = lastColumn ? lastColumn.order + 1 : 0;

        //Generate a unique column ID
        const columnID = `COL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        //Create a new column
        const newColumn = new Column({
            name: req.body.name,
            columnID,
            project: req.body.project,
            userId: req.user.userId,
            order,
        });
        const savedColumn = await newColumn.save();
        res.status(201).json(savedColumn);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Send a GET request to collect all the columns in a project
router.get('/:projectId', authenticateUser, async (req, res) => {
    try {
        const columns = await Column.find({ 
            userId: req.user.userId,                                        // Only fetch the current user's columns
            projectId: req.query.projectId                                  // Only fetch columns in the specified project
             });      
        res.json(issues);                                                   // Send JSON response containing all issue objects
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a column
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const { name, order } = req.body;
        
        // Only allow updating name and order
        const updateData = {};
        if (name) updateData.name = name;
        if (typeof order === 'number') updateData.order = order;

        const column = await Column.findOneAndUpdate(
            { 
                _id: req.params.id, 
                userId: req.user.userId,
                projectId: req.body.projectId 
            },
            updateData,
            { new: true }
        );

        if (!column) {
            return res.status(404).json({ message: 'Column not found or unauthorized' });
        }

        res.json(column);
    } catch (err) {
        console.error('Error updating column:', err);
        res.status(500).json({ message: 'Error updating column' });
    }
});

// Delete a column and its issues
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const column = await Column.findOne({
            _id: req.params.id,
            userId: req.user.userId,
            projectId: req.query.projectId
        });

        if (!column) {
            return res.status(404).json({ message: 'Column not found or unauthorized' });
        }

        // Use the pre('remove') middleware to handle cascading delete
        await column.remove();

        res.json({ message: 'Column and associated issues deleted successfully' });
    } catch (err) {
        console.error('Error deleting column:', err);
        res.status(500).json({ message: 'Error deleting column' });
    }
});

module.exports = router;