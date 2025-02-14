// index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
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

// Simulated guard locations
let guards = [
  { id: 1, lat: 27.6139, lng: 75.209 }, // New Delhi
  { id: 2, lat: 28.6139, lng: 77.209 }, // Mumbai
  { id: 3, lat: 29.6139, lng: 79.209 } // Bangalore
];

// Broadcast updated locations every 2 seconds
// setInterval(() => {
//   guards = guards.map(guard => ({
//     ...guard,
//     lat: guard.lat + (Math.random() - 0.5) * 0.01, // Simulate movement
//     lng: guard.lng + (Math.random() - 0.5) * 0.01
//   }));
  
//   io.emit("guardLocations", guards);
// }, 1000);


// Socket connection handling

io.on("connection", (socket) => {
  console.log("A new guard connected:", socket.id);

  // Handle new guard joining
  socket.on("joinGuard", ({ lat, lng }) => {
    const newGuard = {
      id: socket.id,
      name: `Guard ${guards.length + 1}`,
      lat,
      lng
    };


    guards.push(newGuard);
    io.emit("updateGuards", guards);
  });

    guards.push(newGuard);
    io.emit("updateGuards", guards);
  });

  // Handle real-time location updates
  socket.on("updateLocation", ({ lat, lng }) => {
    guards = guards.map((guard) =>
      guard.id === socket.id ? { ...guard, lat, lng } : guard
    );

    io.emit("updateGuards", guards);
  });

  // Handle guard disconnect
  socket.on("disconnect", () => {
    console.log(`Guard ${socket.id} disconnected`);
    guards = guards.filter((guard) => guard.id !== socket.id);
    io.emit("removeGuard", socket.id);

  });
});

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