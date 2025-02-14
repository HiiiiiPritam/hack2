import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

// Simulated database for organizations and guards
const organizations = {};
const guards = {}; // { socketId: { id, name, lat, lng, orgId, radius } }

export const initSocketServer = (io) => {
  console.log("Socket.io server initialized");
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // When an organization is created, store the room ID
    socket.on("createOrganization", ({ orgId }) => {
      if (!organizations[orgId]) {
        organizations[orgId] = uuidv4(); // Assign a unique room ID
        console.log(
          `Organization ${orgId} created with Room ID ${organizations[orgId]}`
        );
      } else {
        console.log(`Organization ${orgId} already exists`);
      }
    });

    // Join a guard to an organization room
    socket.on("joinGuard", ({ orgId, lat, lng, radius }) => {
      const roomId = organizations[orgId];
      console.log(
        `Guard ${socket.id} joining Room: ${roomId} with orgId: ${orgId} and lat: ${lat} and lng: ${lng} and radius: ${radius}`
      );

      if (!roomId) {
        socket.emit("error", { message: "Organization not found" });
        return;
      }

      // Add guard to the room
      socket.join(roomId);
      guards[socket.id] = {
        id: socket.id,
        name: `Guard ${Object.keys(guards).length + 1}`,
        lat,
        lng,
        radius,
        orgId,
      };

      console.log(`Guard ${socket.id} joined Room: ${roomId}`);

      // await simulateGuardMovement(socket, io);

      // Send updated list of guards to the room
      io.to(roomId).emit(
        "updateGuards",
        Object.values(guards).filter((g) => g.orgId === orgId)
      );
    });

    // Update guard location and check geofence
    socket.on("updateLocation", ({ orgId, lat, lng, radius }) => {
      let guard = guards[socket.id]; // Get existing guard
      
      console.log("Top mei", orgId, lat, lng, radius);
      
      if (!guard) {
        // If not joined, first join the guard
        const roomId = organizations[orgId];
        console.log(
          `Guard ${socket.id} joining Room: ${roomId} with orgId: ${orgId} and lat: ${lat} and lng: ${lng} and radius: ${radius}`
        )
        if (!roomId) {
          socket.emit("error", { message: "Organization not found" });
          return;
        }
    
        console.log(orgId, lat, lng, radius);
    
        // Assign guard **before** calculating distance
        guards[socket.id] = {
          id: socket.id,
          name: `Guard ${Object.keys(guards).length + 1}`,
          lat,
          lng,
          radius,
          orgId,
        };
        guard = guards[socket.id]; // Now guard is defined
    
        socket.join(roomId);
        console.log(
          `Guard ${socket.id} joined Room: ${roomId} at (${lat}, ${lng})`
        );
      } else {
        // If already joined, just update location
        guard.lat = lat;
        guard.lng = lng;
        guard.lastUpdate = new Date().toISOString();
      }
    
      // Now guard is guaranteed to exist, so we can calculate distance
      const distance = Math.sqrt((lat - guard.lat) ** 2 + (lng - guard.lng) ** 2);
    
      if (distance > guard.radius) {
        io.to(organizations[guard.orgId]).emit("alert", {
          message: `${guard.name} has moved outside the allowed area!`,
        });
      }
    
      console.log(`Guard ${socket.id} updated to(${lat}, ${lng})`);
    
      io.to(organizations[guard.orgId]).emit(
        "updateGuards",
        Object.values(guards).filter((g) => g.orgId === guard.orgId)
      );
    }); 

    // Handle disconnect
    socket.on("disconnect", () => {
      const guard = guards[socket.id];
      if (guard) {
        delete guards[socket.id];
        io.to(organizations[guard.orgId]).emit(
          "updateGuards",
          Object.values(guards).filter((g) => g.orgId === guard.orgId)
        );
      }
      console.log(`Guard ${socket.id} disconnected`);
    });
  });
};

// function simulateGuardMovement(socket, io) {
//   let guard = guards[socket.id];
//   if (!guard) return;

//   const interval = setInterval(() => {
//     if (!guards[socket.id]) {
//       clearInterval(interval);
//       return;
//     }

//     // Move guard slightly
//     guard.lat += (Math.random() - 0.5) * 0.1; // Small movement
//     guard.lng += (Math.random() - 0.5) * 0.1;

//     // Emit location update
//     io.to(organizations[guard.orgId]).emit("updateGuards", Object.values(guards).filter((g) => g.orgId === guard.orgId));

//     // Check if out of bounds
//     const distance = Math.sqrt((guard.lat - guard.lat) ** 2 + (guard.lng - guard.lng) ** 2);
//     if (distance > guard.radius) {
//       io.to(organizations[guard.orgId]).emit("alert", {
//         message: `${guard.name} has moved outside the allowed area! 🚨`,
//       });
//       clearInterval(interval); // Stop further movement after alert
//     }
//   }, 1000); // Moves every 5 seconds
// }
