const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },              //User who created the issue
    column: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },            //Column our issue belongs to

    title: { type: String, required: true },                                                    //Title of our issue
    body: { type: String, default: "" },                                                        //Description of our issue
    tags: { type: [String], default: [] },                                                      //Tags for our issue
    completed: { type: Boolean, default: false },                                               //Is the issue completed
});

//Mongoose pluralizes the collection name as 'issues'
module.exports = mongoose.model('Issue', IssueSchema);
