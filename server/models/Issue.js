const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    column: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    order: { type: Number, required: true },
    tags: { type: [String], default: [] },
    completed: { type: Boolean, default: false }
});


//Mongoose pluralizes the collection name as 'issues'
module.exports = mongoose.model('Issue', IssueSchema);
