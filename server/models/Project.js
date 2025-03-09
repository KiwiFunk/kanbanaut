const mongoose = require('mongoose');
const Column = require('./Column');
const Issue = require('./Issue');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },                                             //Name of our project  
    // Removed projectId as it's redundant with MongoDB's _id
    description: { type: String, default: '' },                                         //Optional description of our project
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },      //User who the project belongs to
    // Replacing columns with a reverse refrerence inside the column model itself. 
});

// Middleware to handle cascading delete
ProjectSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        // Find all columns in this project
        const columns = await Column.find({ project: this._id });
        
        // Delete all issues in those columns
        for (const column of columns) {
            await Issue.deleteMany({ column: column._id });
        }
        
        // Delete all columns
        await Column.deleteMany({ project: this._id });
        
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Project', ProjectSchema);