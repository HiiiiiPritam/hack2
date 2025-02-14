// socketServer.js
export const initSocketServer = (io) => {
    // Guard locations data with more detailed information
    let guards = [
      { 
        id: 'guard-1',
        name: "Guard 1",
        lat: 27.6139,
        lng: 75.209,
        status: "active",
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'guard-2',
        name: "Guard 2",
        lat: 28.6139,
        lng: 77.209,
        status: "active",
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'guard-3',
        name: "Guard 3",
        lat: 29.6139,
        lng: 79.209,
        status: "active",
        lastUpdate: new Date().toISOString()
      }
    ];
  
    // Store connected clients
    const connectedClients = new Set();
  
    // Socket connection handling
    io.on("connection", (socket) => {
      try {
        console.log("Client connected:", socket.id);
        connectedClients.add(socket.id);
  
        // Send initial guard locations
        socket.emit("guardLocations", guards);
  
        // Handle new guard joining
        socket.on("joinGuard", ({ lat, lng }) => {
          try {
            const newGuard = {
              id: socket.id,
              name: `Guard ${guards.length + 1}`,
              lat,
              lng,
              status: "active",
              lastUpdate: new Date().toISOString()
            };
  
            guards.push(newGuard);
            io.emit("updateGuards", guards);
          } catch (error) {
            console.error('Error in joinGuard handler:', error);
          }
        });
  
        // Handle real-time location updates
        socket.on("updateLocation", ({ lat, lng }) => {
          try {
            guards = guards.map((guard) =>
              guard.id === socket.id 
                ? { 
                    ...guard, 
                    lat, 
                    lng, 
                    lastUpdate: new Date().toISOString() 
                  } 
                : guard
            );
  
            io.emit("updateGuards", guards);
          } catch (error) {
            console.error('Error in updateLocation handler:', error);
          }
        });
  
        // Handle guard status updates
        socket.on("updateGuardStatus", ({ guardId, status }) => {
          try {
            const guardIndex = guards.findIndex(g => g.id === guardId);
            if (guardIndex !== -1) {
              guards[guardIndex].status = status;
              guards[guardIndex].lastUpdate = new Date().toISOString();
              io.emit("updateGuards", guards);
            }
          } catch (error) {
            console.error('Error in updateGuardStatus handler:', error);
          }
        });
  
        // Handle guard disconnect
        socket.on("disconnect", (reason) => {
          console.log(`Guard ${socket.id} disconnected. Reason: ${reason}`);
          guards = guards.filter((guard) => guard.id !== socket.id);
          connectedClients.delete(socket.id);
          io.emit("removeGuard", socket.id);
        });
  
        // Handle errors
        socket.on("error", (error) => {
          console.error("Socket error:", error);
        });
  
      } catch (error) {
        console.error('Error in socket connection handler:', error);
      }
    });
  
    // Optional: Simulate guard movement
    const locationUpdateInterval = setInterval(() => {
      try {
        guards = guards.map(guard => ({
          ...guard,
          lat: guard.lat + (Math.random() - 0.5) * 0.01,
          lng: guard.lng + (Math.random() - 0.5) * 0.01,
          lastUpdate: new Date().toISOString()
        }));
  
        if (connectedClients.size > 0) {
          io.emit("updateGuards", guards);
        }
      } catch (error) {
        console.error('Error updating guard locations:', error);
      }
    }, 1000);
  
    // Return cleanup function
    return () => {
      clearInterval(locationUpdateInterval);
      io.close();
    };
  };