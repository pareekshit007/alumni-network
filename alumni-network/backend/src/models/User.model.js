const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  graduationYear: { type: Number },
  branch: { type: String },
  currentCompany: { type: String },
  currentRole: { type: String },
  location: { type: String },
  skills: [{ type: String }],
  linkedIn: { type: String },
  github: { type: String },
  role: { type: String, enum: ['student', 'alumni', 'admin'], default: 'alumni' },
  connections: [connectionSchema],
}, { timestamps: true });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
