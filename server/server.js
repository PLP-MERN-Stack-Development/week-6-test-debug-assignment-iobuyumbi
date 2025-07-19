// server.js - Main server file for Socket.io chat application

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const messageController = require("./controllers/messageController");
const userController = require("./controllers/userController");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Import and use socket event handler
require("./socket")(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Use routes
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Socket.io Chat Server is running");
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
