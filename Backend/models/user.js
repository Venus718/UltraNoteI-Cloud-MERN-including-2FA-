const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true},
    mail: {type: String, required: true},
    phone: { type: String, required: true},
    password: {type: String, min: 8, max: 18, required: true},
    isActive: {type: Boolean, default: false, required: true},
    two_fact_auth: {type: String, default: false, required: true},
    creationDate: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('User', UserSchema);
