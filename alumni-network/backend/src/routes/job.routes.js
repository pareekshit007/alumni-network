const express = require('express');
const { getJobs, getJob, createJob, updateJob, deleteJob, applyToJob } = require('../controllers/job.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
  .get(protect, getJobs)
  .post(protect, authorizeRoles('alumni', 'admin'), createJob);

router.route('/:id')
  .get(protect, getJob)
  .put(protect, authorizeRoles('alumni', 'admin'), updateJob)
  .delete(protect, authorizeRoles('alumni', 'admin'), deleteJob);

router.post('/:id/apply', protect, applyToJob);

module.exports = router;
