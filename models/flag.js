
// Mongoose / Model Config SCHEMA SETUP

const mongoose = require('mongoose')


const flagSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    }
});

module.exports = mongoose.model("Flag", flagSchema)