const express = require('express');
const { getUsers, getUserProfile, updateProfile, uploadAvatar, connectUser, getStats } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../config/multer');

const router = express.Router();

router.get('/stats', protect, getStats);
router.get('/', protect, getUsers);
router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/:id/connect', protect, connectUser);

module.exports = router;
