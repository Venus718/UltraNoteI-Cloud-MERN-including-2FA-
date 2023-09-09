const mongoose = require('mongoose');
const User = require('./user');

const ChatRoomMessageSchema = mongoose.Schema({
    messageId: { type: String },
    senderUser: { type: String, required: true, ref: User },
    createdAt: { type: String, default: Date.now() },
    msgType: { type: String, required: true },
    status: { type: String, default: 'pending' },
    message: { type: String },
    isDeleted: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false }
});

module.exports = mongoose.model('ChatRoomMessage', ChatRoomMessageSchema);