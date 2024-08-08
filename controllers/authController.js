const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, github } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email and password are required.');
    }

    const user = new User({ firstname, lastname, email, password, github });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');
    
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
