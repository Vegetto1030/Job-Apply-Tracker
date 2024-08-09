const Job = require('../models/job');

exports.createJob = async (req, res) => {
  try {
    const job = new Job({ ...req.body, user: req.user.id });
    await job.save();
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getJobs = async (req, res) => {
    try {
      const { search, status } = req.query;
      let query = { user: req.user.id };
  
      if (search && search !== '') {
        query.title = new RegExp(search, 'i');
      }
  
      if (status && status !== '') {
        query.status = status;
      }
  
      const jobs = await Job.find(query);
      res.render('dashboard', { jobs, search, status });
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
  

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user.id });
    if (!job) return res.status(404).send('Job not found');
    res.render('jobDetail', { job });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getJobForEdit = async (req, res) => {  // Add this function
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user.id });
    if (!job) return res.status(404).send('Job not found');
    res.render('editJob', { job });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).send('Job not found');
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!job) return res.status(404).send('Job not found');
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
