# **Real-Time Chat Application**

A real-time chat application built with **Node.js**, **Express**, **WebSockets**, and **MongoDB**. Users can register, log in, join rooms, and exchange messages instantly. Profile pictures and user bios are supported via file uploads.

## **Table of Contents**

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Requirements](#requirements)  
- [Getting Started](#getting-started)  
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
- [WebSocket Events](#websocket-events)  
- [File Uploads](#file-uploads)  
- [Docker Deployment](#docker-deployment)  
- [Contributing](#contributing)  
- [License](#license)

---

## **Features**

1. **User Authentication**  
   - Register and login using JWT  
   - Passwords securely hashed with bcrypt

2. **Room-Based Chat**  
   - Join or leave specific chatrooms  
   - Real-time messaging via WebSockets

3. **Profile Management**  
   - Upload profile pictures (handled by Multer)  
   - Update user bios, view other users’ bios

4. **Chat History**  
   - Messages stored in MongoDB  
   - Fetch previous messages on room join

5. **Scalable Architecture**  
   - PM2 / Docker setup for production readiness

---

## **Tech Stack**

- **Backend**: Node.js, Express  
- **Database**: MongoDB (Mongoose ODM)  
- **Real-Time**: WebSockets ([ws] or Socket.io)  
- **Authentication**: JSON Web Tokens (JWT)  
- **File Handling**: Multer  
- **Deployment/Process Manager**: PM2, Docker (optional)  

---

## **Requirements**

- **Node.js** (version 14 or higher recommended)  
- **npm** or **Yarn**  
- **MongoDB** (local or Atlas)  
- **PM2** for process management  
- **Docker** installed for containerized deployment  

---

## **Getting Started**

1. **Clone the Repository**  
   ```bash
   git clone git@github.com:MaiAl-Yamani/Chat-Application.git
   cd Chat-Application
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**  
   - Create a `.env` file in the root directory:
     ```bash
     PORT=3000
     MONGO_URI=mongodb://localhost:27017/chatApp
     JWT_SECRET=YourJWTSecret
     ```
   - Update `MONGO_URI` with your actual MongoDB connection string.

4. **Run the Application**  
   ```bash
   node server.js
   ```
   or
   ```bash
   pm2 start ecosystem.config.js
   ```

5. **Access the Application**  
   - By default, the server runs on `http://localhost:3000`.

---

## **Usage**

1. **Register or Login**  
   - Send a POST request to `/auth/register` or `/auth/login`.  
   - On successful login, you receive a JWT token.

2. **Join a Room** (via WebSocket)  
   - Send a JSON message of type `"join"` with a room name.

3. **Send Messages**  
   - Send a JSON message of type `"message"` with the room name and content.

4. **Profile Management**  
   - To update your bio and upload a profile picture, use the endpoint `/profile/update` with form-data.

---

## **API Endpoints**

- **`POST /auth/register`**  
  - Body: `{ username, password }`  
  - Registers a new user.

- **`POST /auth/login`**  
  - Body: `{ username, password }`  
  - Authenticates the user and returns a JWT token.

- **`GET /profile/view`**  
  - Headers: `Authorization: Bearer <token>`  
  - Returns the current user’s profile (excluding password).

- **`POST /profile/update`**  
  - Headers: `Authorization: Bearer <token>`  
  - Form Data: `bio`, `profilePicture` (as file)  
  - Updates the user’s bio and profile picture.

- **`GET /rooms`**  
  - Returns a list of active rooms and their members.

*(Adjust or add more endpoints as per your project’s implementation.)*

---

## **WebSocket Events**

1. **Authenticate**  
   - **Incoming**:  
     ```json
     {
       "type": "auth",
       "token": "<jwt_token>"
     }
     ```
   - **Response**: `{"type":"auth_success"}` or `{"type":"auth_error"}`  

2. **Join Room**  
   - **Incoming**:  
     ```json
     {
       "type": "join",
       "room": "general"
     }
     ```
   - **Response**: `{"type":"join_success","room":"general"}`

3. **Leave Room**  
   - **Incoming**:  
     ```json
     {
       "type": "leave",
       "room": "general"
     }
     ```
   - **Response**: `{"type":"leave_success","room":"general"}`

4. **Send Message**  
   - **Incoming**:  
     ```json
     {
       "type": "message",
       "room": "general",
       "content": "Hello Everyone!"
     }
     ```
   - **Broadcast**:  
     ```json
     {
       "type": "message",
       "message": {
         "room": "general",
         "content": "Hello Everyone!",
         "sender": "<userId>",
         "timestamp": "<timestamp>"
       }
     }
     ```

---

## **File Uploads**

- **Uploads Directory**: All profile pictures are stored in `uploads/` (by default).  
- **Multer**: Configured to accept only image files (JPEG, PNG, etc.).  
- **Serving Images**: Images served statically via `app.use('/uploads', express.static('uploads'));`

---

## **Docker Deployment**

1. **Build the Docker Image**  
   ```bash
   docker build -t chat-application .
   ```

2. **Run the Container**  
   ```bash
   docker run -p 3000:3000 chat-application
   ```

3. **Access the App**  
   - The application is accessible on `http://localhost:3000`.

*(Make sure you have Docker installed and properly configured.)*

---

## **Contributing**

1. **Fork** the repository  
2. **Create** a new branch: `git checkout -b feature/my-feature`  
3. **Commit** your changes: `git commit -m "Add a new feature"`  
4. **Push** to the branch: `git push origin feature/my-feature`  
5. **Open** a Pull Request  

---

## **License**

This project is licensed under the **[MIT License](LICENSE)**. You’re free to use and adapt this code.  
For more details, see the [LICENSE](LICENSE) file.

---

### **Contact**

If you have any questions or suggestions, feel free to open an issue or reach out at [your email or social handle].

---

*Thank you for checking out our Real-Time Chat Application!*