const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const jobController = require('../controllers/jobController');
const profileController = require('../controllers/profileController');

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/dashboard', authMiddleware, jobController.getJobs);

router.get('/profile', authMiddleware, profileController.getProfile);
router.post('/profile', authMiddleware, profileController.updateProfile);

router.get('/logout', (req, res) => {  // Add this route
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
