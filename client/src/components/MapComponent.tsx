import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSocketStore } from "../zustand/useSocketStore";
import { useParams } from "react-router-dom";

const guardIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Guard {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const MapComponent: React.FC = () => {
  const { socket } = useSocketStore();
  const [guards, setGuards] = useState<Guard[]>([]);
  const { orgId } = useParams<{ orgId: string }>();
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Get user's location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMyLocation({lat: latitude, lng: longitude });

          // Send location to server
          socket.emit("joinGuard", {orgId : orgId as string,lat: latitude, lng: longitude, radius: 0.1 });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    }

    // Listen for guard updates
    socket.on("updateGuards", (updatedGuards: Guard[]) => {
      setGuards(updatedGuards);
    });

    socket.on("removeGuard", (guardId: string) => {
      setGuards((prevGuards) => prevGuards.filter((guard) => guard.id !== guardId));
    });

    return () => {
      socket.off("updateGuards");
      socket.off("removeGuard");
    };
  }, [socket]);

  return (
    <MapContainer center={myLocation || [28.6139, 77.209]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
      />
      {guards.map((guard) => (
        <Marker key={guard.id} position={[guard.lat, guard.lng]} icon={guardIcon}>
          <Tooltip>{guard.name}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
