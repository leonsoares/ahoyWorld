const mongoose = require('mongoose')
const passaportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
    // email: String,
    // comments: []
})

UserSchema.plugin(passaportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)