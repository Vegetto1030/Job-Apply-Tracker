const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  website: String,
  employerContact: {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  origin: String,
  status: String,
  comments: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Job = mongoose.model('Job', JobSchema);
module.exports = Job;
