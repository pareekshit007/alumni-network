const User = require('../models/User.model');
const Job = require('../models/Job.model');
const Event = require('../models/Event.model');

exports.getUsers = async (req, res, next) => {
  try {
    const { search, company, skills, graduationYearMin, graduationYearMax, branch, location, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (company) query.currentCompany = { $regex: company, $options: 'i' };
    if (branch) query.branch = branch;
    if (location) query.location = { $regex: location, $options: 'i' };
    
    if (graduationYearMin || graduationYearMax) {
      query.graduationYear = {};
      if (graduationYearMin) query.graduationYear.$gte = Number(graduationYearMin);
      if (graduationYearMax) query.graduationYear.$lte = Number(graduationYearMax);
    }
    
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('connections.user', 'name avatar role currentCompany');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updateData = req.body;
    // Don't allow protected fields override
    delete updateData.password;
    delete updateData.role;
    delete updateData.email;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a file' });
    
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
        req.user.id, 
        { avatar: avatarUrl }, 
        { new: true }
    ).select('-password');
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.connectUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    if (targetUserId === req.user.id.toString()) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    const { action } = req.body; // 'send', 'accept', 'reject'
    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ message: 'Target user not found' });

    if (action === 'send') {
      const alreadyConnected = user.connections.find(c => c.user.toString() === targetUserId);
      if (alreadyConnected) return res.status(400).json({ message: 'Connection already exists' });

      user.connections.push({ user: targetUser._id, status: 'pending' });
      targetUser.connections.push({ user: user._id, status: 'pending' });
    } else if (action === 'accept') {
      const myConn = user.connections.find(c => c.user.toString() === targetUserId);
      const theirConn = targetUser.connections.find(c => c.user.toString() === user._id.toString());
      if (myConn) myConn.status = 'accepted';
      if (theirConn) theirConn.status = 'accepted';
    } else if (action === 'reject') {
      user.connections = user.connections.filter(c => c.user.toString() !== targetUserId);
      targetUser.connections = targetUser.connections.filter(c => c.user.toString() !== user._id.toString());
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await user.save();
    await targetUser.save();

    res.status(200).json({ success: true, message: `Connection ${action} successful` });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const totalJobs = await Job.countDocuments();
    const totalEvents = await Event.countDocuments();
    const user = await User.findById(req.user.id);
    const myConnections = user.connections.filter(c => c.status === 'accepted').length;

    res.status(200).json({
      success: true,
      data: { totalAlumni, totalJobs, totalEvents, myConnections }
    });
  } catch (error) {
    next(error);
  }
};
