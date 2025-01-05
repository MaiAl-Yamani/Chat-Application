
javascript
Copy code
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const Message = require('./models/Message');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(express.json()); // Middleware for JSON parsing

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/uploads', express.static('uploads')); // Serve static files for profile pictures

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });
const clients = {}; // Keep track of connected WebSocket clients

// WebSocket connection logic
wss.on('connection', (ws, req) => {
	console.log('New WebSocket connection established');

	ws.on('message', async (message) => {
		try {
			const data = JSON.parse(message);

			// Authenticate WebSocket connection
			if (data.type === 'auth') {
				const token = data.token;
				try {
					const decoded = jwt.verify(token, process.env.JWT_SECRET);
					ws.userId = decoded.id;
					clients[ws.userId] = ws; // Store WebSocket client by userId
					ws.send(JSON.stringify({ type: 'auth_success' }));
				} catch (err) {
					ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
					ws.close();
				}
			}

			// Handle incoming messages
			if (data.type === 'message') {
				const { room, content } = data;

				// Save message to database
				const messageDoc = new Message({
					room,
					content,
					sender: ws.userId,
					timestamp: new Date(),
				});
				await messageDoc.save();

				// Broadcast message to clients in the same room
				for (const client of Object.values(clients)){
					client.send(JSON.stringify({ type: 'message', message: messageDoc }));
				}
			}
		} catch (err) {
			console.error('Error handling WebSocket message:', err);
			ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
		}
	});

	ws.on('close', () => {
		console.log('WebSocket connection closed');
		// Remove client from the clients list
		for (const userId in clients) {
			if (clients[userId] === ws) {
				delete clients[userId];
				break;
			}
		}
	});
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
