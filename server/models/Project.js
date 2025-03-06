const mongoose = require('mongoose');
const Column = require('./Column');
const Issue = require('./Issue');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },                                             //Name of our project                      
    description: { type: String, default: '' },                                         //Optional description of our project
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },      //User who the project belongs to
    columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column', default: [] }],    //Columns in our project
});

// Middleware to handle cascading delete of project's columns and issues
ProjectSchema.pre('remove', async function(next) {
    try {
        // Find all columns in this project
        const columns = await Column.find({ projectId: this._id });

        // For each column, delete its issues
        for (const column of columns) {
            await Issue.deleteMany({ columnId: column._id });
        }

        // Delete all columns in this project
        await Column.deleteMany({ projectId: this._id });

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Project', ProjectSchema);