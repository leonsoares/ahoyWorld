
const mongoose               = require('mongoose');
const passaportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true},
    password: String,
    avatar: { type: String, default: "/images/user.png"},
    firstName: String,
    location:{
        country: String,
        state: String
    },
    lastName: String,
    facebook: String,
    instagram: String,
    description: String,
    email: { type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // badges: {
    //     visited: {type: Number, default: 0},
    //     dreamer: {limit: 0},
    //     tourist: {limit: 5},
    //     sightseer: {limit: 10},
    //     voyager: {limit: 15},
    //     navigator: {limit: 20},
    //     globetrotter: {limit: 25}
    // },
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    highRank: { type: Boolean, default: false}
});

UserSchema.plugin(passaportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);