const Conversation = require('../models/Conversation.model');
const Message = require('../models/Message.model');
const { getIo } = require('../config/socket');

exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'name avatar role')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: conversations });
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user.id)) {
        return res.status(403).json({ message: 'Not authorized or conversation not found' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read for this user
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: req.user.id }, read: false },
      { read: true }
    );

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, conversationId } = req.body;
    let convId = conversationId;

    if (!convId && receiverId) {
      let conversation = await Conversation.findOne({
        participants: { $all: [req.user.id, receiverId] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user.id, receiverId]
        });
      }
      convId = conversation._id;
    }

    if (!convId) {
        return res.status(400).json({ message: 'receiverId or conversationId required' });
    }

    const message = await Message.create({
      conversation: convId,
      sender: req.user.id,
      content
    });

    await Conversation.findByIdAndUpdate(convId, { 
        lastMessage: message._id, 
        updatedAt: Date.now() 
    });

    const populatedMsg = await Message.findById(message._id).populate('sender', 'name avatar');

    // Emit live event safely
    try {
      getIo().to(convId.toString()).emit('new_message', populatedMsg);
    } catch (socketErr) {
      console.error('Socket error emitting message', socketErr);
    }

    res.status(201).json({ success: true, data: populatedMsg });
  } catch (err) {
    next(err);
  }
};
