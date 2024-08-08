const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const jobController = require('../controllers/jobController');

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/dashboard', authMiddleware, jobController.getJobs);

module.exports = router;
