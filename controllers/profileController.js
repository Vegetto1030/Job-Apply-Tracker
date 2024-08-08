const User = require('../models/user');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.render('profile', { user });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.redirect('/dashboard');  // Redirect to dashboard after saving profile
  } catch (error) {
    res.status(400).send(error.message);
  }
};
