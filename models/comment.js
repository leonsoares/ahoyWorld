
// Mongoose / Model Config SCHEMA SETUP

const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({
    author: String,
    text: String
});

// const Comment = mongoose.model('Comment', commentSchema)

module.exports = mongoose.model("Comment", commentSchema)