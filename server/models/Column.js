const mongoose = require('mongoose');

const ColumnSchema = new mongoose.Schema({
    name: { type: String, required: true },                                                     //Name of our column
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },          //Project our column belongs to
    issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue', default: [] }],              //Issues in our column
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },              //User who created the column 
});

module.exports = mongoose.model('Column', ColumnSchema);