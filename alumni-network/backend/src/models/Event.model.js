const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  banner: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String },
  onlineLink: { type: String },
  type: { type: String, enum: ['Online', 'Offline'], required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxAttendees: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
