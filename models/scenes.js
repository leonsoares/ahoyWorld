const mongoose = require('mongoose')

const sceneSchema = new mongoose.Schema({
    
    name: String,
    location: String,
    description: String,
    image: String,
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// const Scene = mongoose.model('Scene', sceneSchema)

module.exports = mongoose.model("Scene", sceneSchema)