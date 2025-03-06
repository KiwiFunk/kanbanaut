const mongoose = require('mongoose');
const Project = require('./Project');
const Column = require('./Column');
const Issue = require('./Issue');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },          // Email address
    password: { type: String, required: true },                     // Hashed password
    username: { type: String, required: true, default: 'user' }     // Display name
});

// Middleware to handle cascading delete of user's projects, columns and issues
UserSchema.pre('remove', async function(next) {
    try {
        // Find all projects belonging to this user
        const projects = await Project.find({ userId: this._id });
        
        // For each project, delete its columns and issues
        for (const project of projects) {
            // Find all columns in this project
            const columns = await Column.find({ projectId: project._id });
            
            // Delete all issues in those columns
            for (const column of columns) {
                await Issue.deleteMany({ columnId: column._id });
            }
            
            // Delete all columns in this project
            await Column.deleteMany({ projectId: project._id });
        }
        
        // Finally delete all projects belonging to this user
        await Project.deleteMany({ userId: this._id });
        
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);