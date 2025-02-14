// routes/guard.routes.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all guards for an organization
router.get('/org/:orgId/guards', authenticate, async (req, res) => {
  try {
    const { orgId } = req.params;
    const guards = await prisma.guard.findMany({
      where: { organizationId: orgId },
      include: {
        currentLocation: true,
        shifts: {
          where: { endTime: null }, // Get active shifts
          take: 1
        }
      }
    });
    res.json(guards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guards' });
  }
});

// Update guard location
router.post('/guard/location', authenticate, async (req, res) => {
  try {
    const { guardId, lat, lng, timestamp } = req.body;
    
    const location = await prisma.guardLocation.create({
      data: {
        latitude: lat,
        longitude: lng,
        timestamp: new Date(timestamp),
        guardId
      }
    });

    // Check geofence
    const guard = await prisma.guard.findUnique({
      where: { id: guardId },
      include: { assignedArea: true }
    });

    if (guard?.assignedArea) {
      const isOutsideGeofence = checkGeofence(
        lat,
        lng,
        guard.assignedArea.centerLat,
        guard.assignedArea.centerLng,
        guard.assignedArea.radiusMeters
      );

      if (isOutsideGeofence) {
        await prisma.alert.create({
          data: {
            type: 'GEOFENCE_BREACH',
            message: `Guard ${guard.name} has left assigned area`,
            guardId,
            organizationId: guard.organizationId
          }
        });
      }
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Start guard shift
router.post('/guard/shift/start', authenticate, async (req, res) => {
  try {
    const { guardId, areaId } = req.body;
    
    const shift = await prisma.shift.create({
      data: {
        guardId,
        areaId,
        startTime: new Date()
      }
    });

    res.json(shift);
  } catch (error) {
    res.status(500).json({ error: 'Failed to start shift' });
  }
});

// Report incident
router.post('/incident', authenticate, async (req, res) => {
  try {
    const { type, description, lat, lng, guardId, orgId } = req.body;
    
    const incident = await prisma.incident.create({
      data: {
        type,
        description,
        latitude: lat,
        longitude: lng,
        guardId,
        organizationId: orgId,
        timestamp: new Date()
      }
    });

    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Failed to report incident' });
  }
});

// Helper function to check if point is outside geofence
function checkGeofence(
  lat1,
  lng1,
  lat2,
  lng2,
  radiusMeters
){
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lng2-lng1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distance = R * c;
  return distance > radiusMeters;
}

// Join organization/room route
router.post('/join',  async (req, res) => {
    try {
      const { guardId, orgId } = req.body;
      
      const guard = await prisma.guard.update({
        where: { id: guardId },
        data: { 
          isOnline: true,
          organizationId: orgId
        }
      });
  
      // Emit joined event via socket
      req.app.get('io').to(orgId).emit('guardJoined', guard);
  
      res.json(guard);
    } catch (error) {
      res.status(500).json({ error: 'Failed to join' });
    }
  });
  
  // Update position route
  router.post('/position', async (req, res) => {
    try {
      const { guardId, lat, lng } = req.body;
  
      const location = await prisma.guardLocation.create({
        data: {
          guardId,
          latitude: lat,
          longitude: lng,
          timestamp: new Date()
        }
      });
  
    //   // Emit position update via socket
    //   req.app.get('io').to(orgId).emit('updateGuards', {
    //     id: guardId,
    //     lat,
    //     lng
    //   });
  
    //   res.json(location);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update position' });
    }
  });

export default router;


// join

//update position

