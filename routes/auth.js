const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Register user with file uploads
router.post('/register', upload, authController.registerUser);

// Login user
router.post('/login', authController.login);

// Render registration page
router.get('/register', (req, res) => {
  res.render('register');
});

// Render login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Render profile page with authentication middleware
router.get('/profile', authMiddleware, authController.renderProfile);

// Update profile with file uploads and authentication middleware
router.post('/profile', authMiddleware, upload, authController.updateProfile);

module.exports = router;
