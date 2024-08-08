const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  github: String,
  profilePicture: String,
  cv: String,
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
