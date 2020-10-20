const mongoose = require('mongoose')

const sceneSchema = new mongoose.Schema({
    
    name: String,
    sceneType: String,
    location:{
        country: String,
        state: String,
    },
    lat: Number,
    lng: Number,
    description: String,
    image: String,
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },

    lat: Number,
    lng: Number,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    flag: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    saveScene: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    isPopular: { type: Boolean, default:false }
    
});

module.exports = mongoose.model("Scene", sceneSchema)