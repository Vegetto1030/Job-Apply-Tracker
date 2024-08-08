const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.cookies.token || '';
  if (!token) {
    return res.status(401).redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    console.error('Error in authentication middleware:', err);
    res.status(401).redirect('/auth/login');
  }
};
