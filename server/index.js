import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import initSocketServer from "./socket/socketServer";
import dotenv from "dotenv";

// Express app setup
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup with error handling
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  connectTimeout: 60000
});

// Handle socket server errors
io.engine.on("connection_error", (err) => {
  console.log('Connection error:', err);
});

// Initialize socket server
initSocketServer(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Graceful shutdown
  server.close(() => {
    process.exit(1);
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
