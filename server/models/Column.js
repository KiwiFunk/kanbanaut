const mongoose = require('mongoose');
const Issue = require('./Issue');

const ColumnSchema = new mongoose.Schema({
    name: { type: String, required: true },                                                     //Frontend name of our column
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },          //Project our column belongs to
    issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue', default: [] }],              //Issues in our column
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },              //User who created the column 
    order: { type: Number, required: true },                                                    //Order of the column
});

// Middleware to handle cascading delete of column's issues
ColumnSchema.pre('remove', async function(next) {
    try {
        // Delete all issues in this column
        await Issue.deleteMany({ columnId: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Column', ColumnSchema);