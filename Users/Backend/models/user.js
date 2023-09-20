const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mail: { type: String, required: true },
    phone: { type: String, required: false },
    password: { type: String, min: 8, max: 18, required: true },
    image: { type: String, require: false },
    isActive: { type: Boolean, default: false, required: true },
    IsAdmin: { type: Boolean, default: false },
    IsMuted: { type: Boolean, default: false },
    two_fact_auth: { type: Boolean, default: false, required: true },
    two_fact_auth_tmp: {type: Boolean, default: false, require: true},
    two_fact_auth_code: { type: Number, default: null },
    otp_auth_code: { type: Number, default: null },
    otp_auth: { type: Boolean, default: false, require: true},
    secret: {type: Object,default: null},
    creationDate: { type: Date, default: Date.now() },
    contacts: { type: [Object], default: null },
    isWalletCreated: { type: Boolean, default: false },
    currency: { type: String, default: 'usd' },
});

module.exports = mongoose.model('User', UserSchema);
