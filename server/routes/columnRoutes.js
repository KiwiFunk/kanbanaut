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