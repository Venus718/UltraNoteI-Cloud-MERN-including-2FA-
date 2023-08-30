const mongoose = require('mongoose');
const User = require('./user');

const ChatRoomMessageSchema = mongoose.Schema({
    messageId: { type: mongoose.Schema.Types.ObjectId },
    senderUser: { type: String, required: true, ref: User },
    createdAt: { type: String, default: Date.now() },
    msgType: { type: String, required: true },
    status: { type: String, default: 'pending' },
    message: { type: String },
    isRead: { type: Boolean }
});

module.exports = mongoose.model('ChatRoomMessage', ChatRoomMessageSchema);