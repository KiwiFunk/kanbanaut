const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: { type: String, required: true },                                                    //Title of our issue
    body: { type: String, default: "" },                                                        //Description of our issue
    status: { type: String, enum: ['todo', 'inprogress', 'complete'], default: 'todo' },        //Status of our issue
    completed: { type: Boolean, default: false },                                               //Is the issue completed
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },              //User who created the issue
});

module.exports = mongoose.model('Todo', TodoSchema);
