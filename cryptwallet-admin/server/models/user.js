const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true },
  mail: { type: String, required: true },
  password: { type: String, required: true, min: 8, max: 18 },
  role: { type: String, required: true, default: 'admin' },
  isActive: { type: String, required: true, default: false },
});

module.exports = mongoose.model('User', UserSchema);
