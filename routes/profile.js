const express = require('express');
const User = require('../models/User');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Update user bio and profile picture
router.post('/update', authMiddleware, upload.single('profilePicture'), async (req, res) => {
	const { bio } = req.body;
	const userId = req.userId;

	try {
		const updateData = { bio };
		if (req.file) {
			updateData.profilePicture = req.file.path; // Save the file path
		}

		const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
		res.status(200).json({ message: 'Profile updated successfully', user });
	} catch (err) {
		res.status(500).json({ error: 'Profile update failed' });
	}
});

module.exports = router;

