const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Retrieve user profile
router.get('/view', authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      username: user.username,
      bio: user.bio,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// Update user profile
router.post('/update',
  authMiddleware,
  upload.single('profilePicture'),
  [
    body('bio')
      .optional()
      .isLength({ max: 200 }).withMessage('Bio must not exceed 200 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bio } = req.body;
    const userId = req.userId;

    try {
      const updateData = {};
      if (bio) updateData.bio = bio;
      if (req.file) updateData.profilePicture = req.file.path;

      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
      res.status(500).json({ error: 'Profile update failed' });
    }
  }
);

module.exports = router;
