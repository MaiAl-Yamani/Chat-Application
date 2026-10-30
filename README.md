# Real-Time Chat Application

A Node.js backend for real-time, room-based messaging, built with **Express**, **WebSockets**, and **MongoDB**. It combines REST endpoints for user and profile management with WebSocket communication for live chat.

## Features

- User registration and login with JWT-based authentication
- Real-time messaging over WebSockets
- Join and leave chat rooms
- MongoDB-backed message storage
- Profile management endpoints
- Endpoint for viewing active rooms

## Tech Stack

- **Runtime:** Node.js
- **HTTP API:** Express
- **Real-time communication:** `ws` (WebSockets)
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)

## Project Structure

```text
Chat-Application/
├── middleware/  # Request middleware
├── models/      # Database models
├── routes/      # Authentication and profile routes
└── server.js    # Express and WebSocket server
```

## Architecture

The Express server exposes REST endpoints for authentication and profile management. A WebSocket server runs alongside it to handle client authentication, room membership, and live messaging. Messages are persisted using a Mongoose model and broadcast to connected members of the corresponding room.

## API Overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Authenticate and obtain a JWT |
| GET | `/profile/view` | Retrieve a user profile |
| POST | `/profile/update` | Update profile details |
| GET | `/rooms` | List active chat rooms |

## WebSocket Message Types

| Type | Purpose |
| --- | --- |
| `echo` | Echo a payload back to the client |
| `auth` | Authenticate a connection using a JWT |
| `join` | Join a named chat room |
| `leave` | Leave a chat room |
| `message` | Send a message to a room |

Example: authenticate a WebSocket connection:

```json
{
  "type": "auth",
  "token": "YOUR_JWT_TOKEN"
}
```

Join a room:

```json
{
  "type": "join",
  "room": "general"
}
```

Send a message:

```json
{
  "type": "message",
  "room": "general",
  "content": "Hello, everyone!"
}
```

## Configuration

The server reads configuration from environment variables using `dotenv`:

```dotenv
PORT=3000
MONGO_URI=mongodb://localhost:27017/chatApp
JWT_SECRET=replace_with_a_secure_secret
```

## Source Code

- [`server.js`](server.js) — HTTP server, WebSocket events, and room management
- [`routes/`](routes/) — API route handlers
- [`models/`](models/) — MongoDB models
- [`middleware/`](middleware/) — request middleware
