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
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/uploads', express.static('uploads')); // Serve profile picture files

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });
const clients = {}; // Track connected WebSocket clients
const rooms = {};   // Track users in specific rooms

wss.on('connection', (ws, req) => {
  console.log('WebSocket connection established');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'auth') {
        const token = data.token;
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          ws.userId = decoded.id;
          clients[ws.userId] = ws;
          ws.send(JSON.stringify({ type: 'auth_success' }));
        } catch (err) {
          ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
          ws.close();
        }
      }

      if (data.type === 'join') {
        const { room } = data;
        if (!rooms[room]) {
          rooms[room] = new Set();
        }
        rooms[room].add(ws.userId);
        ws.currentRoom = room;
        ws.send(JSON.stringify({ type: 'join_success', room }));
        console.log(`User ${ws.userId} joined room ${room}`);
      }

      if (data.type === 'leave') {
        const { room } = data;
        if (rooms[room]) {
          rooms[room].delete(ws.userId);
          if (rooms[room].size === 0) {
            delete rooms[room];
          }
        }
        ws.currentRoom = null;
        ws.send(JSON.stringify({ type: 'leave_success', room }));
        console.log(`User ${ws.userId} left room ${room}`);
      }

      if (data.type === 'message') {
        const { room, content } = data;

        if (!room || !rooms[room] || !rooms[room].has(ws.userId)) {
          ws.send(JSON.stringify({ type: 'error', message: 'You are not in this room' }));
          return;
        }

        const messageDoc = new Message({
          room,
          content,
          sender: ws.userId,
          timestamp: new Date(),
        });
        await messageDoc.save();

        for (const userId of rooms[room]) {
          if (clients[userId]) {
            clients[userId].send(JSON.stringify({ type: 'message', message: messageDoc }));
          }
        }
      }
    } catch (err) {
      console.error('Error:', err);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    if (ws.currentRoom && rooms[ws.currentRoom]) {
      rooms[ws.currentRoom].delete(ws.userId);
      if (rooms[ws.currentRoom].size === 0) {
        delete rooms[ws.currentRoom];
      }
    }
    delete clients[ws.userId];
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
