const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true},
    mail: {type: String, required: true},
    password: {type: String, required: true, min: 8, max: 18}
});

module.exports = mongoose.model('User', UserSchema);
