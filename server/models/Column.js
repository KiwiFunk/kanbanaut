const mongoose = require('mongoose');
const Issue = require('./Issue');

const ColumnSchema = new mongoose.Schema({
    name: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Number, required: true }
});

// Middleware to handle cascading delete
ColumnSchema.pre('deleteOne', { document: true }, async function(next) {
    try {
        await Issue.deleteMany({ column: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Column', ColumnSchema);