states to maintain--

const appState = {
  guards: {
    list: [], // All guards
    selected: null, // Currently selected guard
    tracking: {} // Real-time locations
  },
  shifts: {
    current: [], // Active shifts
    upcoming: [] // Scheduled shifts
  },
  alerts: {
    active: [], // Current alerts
    history: [] // Past alerts
  },
  geofences: {
    areas: [], // Defined geofence areas
    breaches: [] // Current breaches
  }
};



const modules = [
    {
      name: "Authentication & User Context",
      components: [
        "Login/Register Forms",
        "Role-based Route Guards",
        "User Context Provider"
      ],
      state: [
        "User Role (Admin/Police/Society)",
        "Authentication Token",
        "Organization Context"
      ]
    },
    {
      name: "Map & Tracking Core",
      components: [
        "Interactive Map (Leaflet)",
        "Guard Markers",
        "Geofence Overlay"
      ],
      state: [
        "Active Guards Positions",
        "Selected Guard Details",
        "Geofence Boundaries"
      ]
    },
    {
      name: "Guard Management",
      components: [
        "Guard List/Grid View",
        "Guard Detail Modal",
        "Assignment Interface"
      ],
      state: [
        "Guards List",
        "Selected Guard",
        "Assignment Status"
      ]
    },
    {
      name: "Real-time Updates",
      components: [
        "WebSocket Connection",
        "Alert Notifications",
        "Status Updates"
      ],
      state: [
        "Connection Status",
        "Active Alerts",
        "Guard Status Updates"
      ]
    }
  ];