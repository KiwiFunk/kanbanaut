const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
//Importing column and issue models to cascade delete
const Column = require('../models/Column'); 
const Issue = require('../models/Issue'); 

const authenticateUser = require('../middleware/auth');

// Get all projects for current user
router.get('/', authenticateUser, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user.userId });
        res.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Error fetching projects' });
    }
});

// Create new project
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const project = new Project({
            name,
            description,
            userId: req.user.userId
        });

        await project.save();
        res.status(201).json(project);
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ message: 'Error creating project' });
    }
});

// Update project
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Only allow updating name and description
        const updateData = {};
        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;

        const project = await Project.findOneAndUpdate(
            { 
                _id: req.params.id, 
                userId: req.user.userId 
            },
            updateData,
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found or unauthorized' });
        }

        res.json(project);
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ message: 'Error updating project' });
    }
});

// Delete project and its columns/issues
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found or unauthorized' });
        }

        // Delete all issues in this project's columns
        const columns = await Column.find({ project: project._id });
        for (const column of columns) {
            await Issue.deleteMany({ column: column._id });
        }

        // Delete all columns in this project
        await Column.deleteMany({ project: project._id });
        
        // Delete the project
        await project.deleteOne();

        res.json({ message: 'Project and all associated data deleted successfully' });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get single project by ID
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found or unauthorized' });
        }

        res.json(project);
    } catch (err) {
        console.error('Error fetching project:', err);
        res.status(500).json({ message: 'Error fetching project' });
    }
});

module.exports = router;