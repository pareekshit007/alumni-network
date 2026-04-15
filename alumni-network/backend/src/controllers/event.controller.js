const Event = require('../models/Event.model');

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate('organizer', 'name avatar role').sort({ date: 1 });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
        .populate('organizer', 'name avatar role')
        .populate('attendees', 'name avatar role currentCompany');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    req.body.organizer = req.user.id;
    if (req.file) {
      req.body.banner = `/uploads/${req.file.filename}`;
    }
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    if (req.file) {
      req.body.banner = `/uploads/${req.file.filename}`;
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.toggleRSVP = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isAttending = event.attendees.includes(req.user.id);

    if (isAttending) {
      event.attendees = event.attendees.filter(userId => userId.toString() !== req.user.id);
    } else {
      if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
        return res.status(400).json({ message: 'Event is full' });
      }
      event.attendees.push(req.user.id);
    }

    await event.save();
    res.status(200).json({ success: true, data: event.attendees });
  } catch (err) {
    next(err);
  }
};
