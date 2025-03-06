const mongoose = require('mongoose');
const Issue = require('./Issue');

const ColumnSchema = new mongoose.Schema({
    name: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Number, required: true }
});

// Update middleware to use correct field name
ColumnSchema.pre('remove', async function(next) {
    try {
        await Issue.deleteMany({ column: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Column', ColumnSchema);