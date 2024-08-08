const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.registerUser = async (req, res) => {
  try {
    console.log('Registering user:', req.body);
    console.log('Uploaded files:', req.files);
    
    const { firstname, lastname, email, password } = req.body;
    const profilePicture = req.files['profilePicture'] ? req.files['profilePicture'][0].filename : null;
    const cv = req.files['cv'] ? req.files['cv'][0].filename : null;

    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      profilePicture,
      cv
    });

    await newUser.save();
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).send('Server Error');
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
    console.error('Error during login:', error);
    res.status(400).send(error.message);
  }
};
