
// Mongoose / Model Config SCHEMA SETUP

const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

// const Comment = mongoose.model('Comment', commentSchema)

module.exports = mongoose.model("Comment", commentSchema)