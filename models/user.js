
const mongoose               = require('mongoose');
const passaportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: false},
    password: String,
    avatar: { type: String, default: "/images/user.png"},
    firstName: String,
    lastName: String,
    email: { type: String, unique: false, required: false},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
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
    ]
});

UserSchema.plugin(passaportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);