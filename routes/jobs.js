const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to render job creation form
router.get('/create', authMiddleware, (req, res) => {
  res.render('createJob');
});

// Route to handle job creation
router.post('/create', authMiddleware, jobController.createJob);

// Route to get all jobs for the logged-in user
router.get('/', authMiddleware, jobController.getJobs);

// Route to get job details
router.get('/:id', authMiddleware, jobController.getJobById);

// Route to update a job
router.put('/:id', authMiddleware, jobController.updateJob);

// Route to delete a job
router.delete('/:id', authMiddleware, jobController.deleteJob);

module.exports = router;
