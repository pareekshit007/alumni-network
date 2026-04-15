const express = require('express');
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent, toggleRSVP } = require('../controllers/event.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');
const upload = require('../config/multer');

const router = express.Router();

router.route('/')
  .get(protect, getEvents)
  .post(protect, authorizeRoles('admin'), upload.single('banner'), createEvent);

router.route('/:id')
  .get(protect, getEvent)
  .put(protect, authorizeRoles('admin', 'alumni'), upload.single('banner'), updateEvent)
  .delete(protect, authorizeRoles('admin', 'alumni'), deleteEvent);

router.post('/:id/rsvp', protect, toggleRSVP);

module.exports = router;
