const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for frontend communication

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174", // Allow frontend access
    methods: ["GET", "POST"]
  }
});

// Simulated guard locations
let guards = [
  { id: 1, lat: 27.6139, lng: 75.209 }, // New Delhi
  { id: 2, lat: 28.6139, lng: 77.209 }, // Mumbai
  { id: 3, lat: 29.6139, lng: 79.209 } // Bangalore
];

// Broadcast updated locations every 2 seconds
setInterval(() => {
  guards = guards.map(guard => ({
    ...guard,
    lat: guard.lat + (Math.random() - 0.5) * 0.01, // Simulate movement
    lng: guard.lng + (Math.random() - 0.5) * 0.01
  }));
  
  io.emit("guardLocations", guards);
}, 1000);

io.on("connection", (socket) => {
  console.log("A client connected");

  // Send initial data
  socket.emit("guardLocations", guards);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
