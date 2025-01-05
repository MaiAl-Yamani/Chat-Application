const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
	username: {
		type: String, 
		required: true, 
		unique: true,
		trim: true 
	},
	password: { 
		type: String, 
		required: true 
	},
	bio: { 
		type: String, 
		default: '', 
		trim: true 
	},
	profilePicture: { 
		type: String, 
		default: '' // Path to the uploaded profile picture
	},
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the User model
module.exports = mongoose.model('User', userSchema);
