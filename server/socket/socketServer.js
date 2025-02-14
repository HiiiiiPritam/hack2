// socketServer.js

export const initSocketServer = (io) => {
    // Guard locations data
    let guards = [
      { id: 1, lat: 27.6139, lng: 75.209, name: "Guard 1", status: "active" }, // New Delhi
      { id: 2, lat: 28.6139, lng: 77.209, name: "Guard 2", status: "active" }, // Mumbai
      { id: 3, lat: 29.6139, lng: 79.209, name: "Guard 3", status: "active" }  // Bangalore
    ];
  
    // Store connected clients
    const connectedClients = new Set();
  
    // Update guard locations
    const updateGuardLocations = () => {
      try {
        guards = guards.map(guard => ({
          ...guard,
          lat: guard.lat + (Math.random() - 0.5) * 0.01,
          lng: guard.lng + (Math.random() - 0.5) * 0.01,
          lastUpdate: new Date().toISOString()
        }));
  
        io.emit("guardLocations", guards);
      } catch (error) {
        console.error('Error updating guard locations:', error);
      }
    };
  
    // Start location updates
    const locationUpdateInterval = setInterval(updateGuardLocations, 1000);
  
    // Socket connection handling
    io.on("connection", (socket) => {
      try {
        console.log("Client connected:", socket.id);
        connectedClients.add(socket.id);
  
        // Send initial guard locations
        socket.emit("guardLocations", guards);
  
        // Handle client disconnect
        socket.on("disconnect", (reason) => {
          console.log("Client disconnected:", socket.id, "Reason:", reason);
          connectedClients.delete(socket.id);
        });
  
        // Handle errors
        socket.on("error", (error) => {
          console.error("Socket error:", error);
        });
  
        // Handle custom events
        socket.on("requestGuardLocations", () => {
          socket.emit("guardLocations", guards);
        });
  
        socket.on("updateGuardStatus", (data) => {
          try {
            const { guardId, status } = data;
            const guardIndex = guards.findIndex(g => g.id === guardId);
            if (guardIndex !== -1) {
              guards[guardIndex].status = status;
              io.emit("guardLocations", guards);
            }
          } catch (error) {
            console.error('Error updating guard status:', error);
          }
        });
  
      } catch (error) {
        console.error('Error in socket connection handler:', error);
      }
    });
  
    // Cleanup on server shutdown
    process.on('SIGTERM', () => {
      clearInterval(locationUpdateInterval);
      io.close(() => {
        console.log('Socket.io server closed');
      });
    });
  
    // Return cleanup function
    return () => {
      clearInterval(locationUpdateInterval);
      io.close();
    };
  };
  