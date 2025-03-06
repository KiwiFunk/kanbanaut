const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },                                             //Name of our project                      
    description: { type: String, default: '' },                                         //Optional description of our project
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },        //User who the project belongs to
    columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column', default: [] }],    //Columns in our project
});

module.exports = mongoose.model('Project', ProjectSchema);