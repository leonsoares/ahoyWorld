
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    username: String,
    sceneId: String,
    message: String,
    goTo: String,
    isRead: { type: Boolean, default: false}
});

// UserSchema.plugin(passaportLocalMongoose);
module.exports = mongoose.model('Notification', NotificationSchema);