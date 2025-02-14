import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";

// Connect to the Socket.io server
const socket = io("http://localhost:5000");

// Custom guard icon
const guardIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const myIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [40, 41],
  iconAnchor: [12, 41],
});

interface Guard {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const MapComponent: React.FC = () => {
  const [guards, setGuards] = useState<Guard[]>([]);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user's current location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMyLocation({ lat: latitude, lng: longitude });

          // Send user's location to the server
          socket.emit("joinGuard", { lat: latitude, lng: longitude });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Listen for guard location updates
    socket.on("updateGuards", (updatedGuards: Guard[]) => {
      setGuards(updatedGuards);
    });

    // Remove disconnected guards
    socket.on("removeGuard", (guardId: string) => {
      setGuards((prevGuards) => prevGuards.filter((guard) => guard.id !== guardId));
    });

    return () => {
      socket.off("updateGuards");
      socket.off("removeGuard");
    };
  }, []);

  return (
    <MapContainer center={myLocation || [28.6139, 77.209]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
      />
      {/* //Show the user's own location */}
      {/* {myLocation && (
        <Marker position={[myLocation.lat, myLocation.lng]} icon={guardIcon}>
          <Tooltip>You (My Location)</Tooltip>
        </Marker>
      )} */}
      {/* Show all other guards */}
      {guards.map((guard) => (
        <Marker key={guard.id} position={[guard.lat, guard.lng]} icon={guardIcon}>
          <Tooltip>{guard.name}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
