const express = require('express');
const { getConversations, getMessages, sendMessage } = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
  .get(protect, getConversations)
  .post(protect, sendMessage);

router.get('/:conversationId', protect, getMessages);

module.exports = router;
