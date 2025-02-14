import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store active connections and data
const activeGuards = new Map(); // Maps socketId to guard data
const supervisors = new Map(); // Maps socketId to supervisor data
const geoFences = new Map(); // Maps zoneId to boundary coordinates
const alerts = new Map(); // Maps alertId to alert data

// Constants for events


// Utility functions
const isWithinGeoFence = (location, fence) => {
  // Implementation for checking if a point is within polygon
  // This is a placeholder - you'll need to implement the actual geometry check
  return true;
};

const notifySupervisors = (zoneId, eventType, data) => {
  // Notify all supervisors assigned to a specific zone
  supervisors.forEach((supervisor, socketId) => {
    if (supervisor.zones.includes(zoneId)) {
      io.to(socketId).emit(eventType, data);
    }
  });
};

// Socket connection handler
io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

//   // Guard connects and shares their initial data
//   socket.on(EVENTS.GUARD_CONNECT, (guardData) => {
//     activeGuards.set(socket.id, {
//       ...guardData,
//       lastUpdate: new Date(),
//       status: 'active'
//     });
    
//     // Join the zone-specific room
//     if (guardData.assignedZone) {
//       socket.join(`zone_${guardData.assignedZone}`);
//     }
    
//     // Notify supervisors of new guard connection
//     notifySupervisors(guardData.assignedZone, EVENTS.GUARD_CONNECT, {
//       guardId: guardData.guardId,
//       location: guardData.location
//     });
//   });

//   // Guard location updates
//   socket.on(EVENTS.GUARD_LOCATION, ({ location, zoneId }) => {
//     const guardData = activeGuards.get(socket.id);
//     if (!guardData) return;

//     // Update guard location
//     guardData.location = location;
//     guardData.lastUpdate = new Date();
//     activeGuards.set(socket.id, guardData);

//     // Check for geofence breach
//     const fence = geoFences.get(zoneId);
//     if (fence && !isWithinGeoFence(location, fence)) {
//       // Emit geofence breach alert
//       const alert = {
//         type: 'geofence_breach',
//         guardId: guardData.guardId,
//         location,
//         timestamp: new Date()
//       };
//       io.to(`zone_${zoneId}`).emit(EVENTS.GEOFENCE_BREACH, alert);
//     }

//     // Broadcast location update to supervisors
//     io.to(`zone_${zoneId}`).emit(EVENTS.GUARD_LOCATION, {
//       guardId: guardData.guardId,
//       location,
//       timestamp: new Date()
//     });
//   });

//   // Incident reporting
//   socket.on(EVENTS.INCIDENT_REPORT, (incident) => {
//     const alert = {
//       ...incident,
//       timestamp: new Date(),
//       alertId: Date.now().toString()
//     };
//     alerts.set(alert.alertId, alert);

//     // Notify all relevant parties in the zone
//     io.to(`zone_${incident.zoneId}`).emit(EVENTS.INCIDENT_REPORT, alert);
    
//     // Find nearest guards
//     const nearbyGuards = Array.from(activeGuards.values())
//       .filter(guard => guard.assignedZone === incident.zoneId);
//     // You would implement actual distance calculation here
//   });

//   // Supervisor connects
//   socket.on(EVENTS.SUPERVISOR_CONNECT, (supervisorData) => {
//     supervisors.set(socket.id, supervisorData);
    
//     // Join all relevant zone rooms
//     supervisorData.zones.forEach(zoneId => {
//       socket.join(`zone_${zoneId}`);
//     });
//   });

//   // Handle duty assignments
//   socket.on(EVENTS.ASSIGN_DUTY, ({ guardId, zoneId, shift }) => {
//     // Broadcast duty assignment to relevant guard
//     io.emit(`duty_${guardId}`, { zoneId, shift });
//   });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    const guardData = activeGuards.get(socket.id);
    if (guardData) {
      notifySupervisors(guardData.assignedZone, 'GUARD_DISCONNECT', {
        guardId: guardData.guardId
      });
      activeGuards.delete(socket.id);
    }
    
    supervisors.delete(socket.id);
  });
});

export { app, io, server };