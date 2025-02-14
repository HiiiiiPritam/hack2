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
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (!socket) return;

    let watchId: number;

    // Get user's location
    if ("geolocation" in navigator) {
      // Watch for location changes
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMyLocation({ lat: latitude, lng: longitude });

          console.log(`My current latitude longitude`,latitude,longitude);

          // Send updated location to server
          socket.emit("updateLocation", {
            orgId,
            lat: latitude,
            lng: longitude,
            radius: 0.001,
          });
          if (!isJoined) {
            setIsJoined(true);
            console.log("Joined organization and started location updates.");
          }
        },
        (error) => console.error("Error watching location:", error),
        { enableHighAccuracy: true, maximumAge: 10000 }
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
      if (watchId) navigator.geolocation.clearWatch(watchId); // Clear location watcher on unmount
    };
  }, [socket, orgId, isJoined]);

  return (
    <MapContainer center={myLocation || [28.6139, 77.209]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
      />
      {myLocation && (
        <Marker position={[myLocation.lat, myLocation.lng]} icon={guardIcon}>
          <Tooltip>You are here</Tooltip>
        </Marker>
      )}
      {guards.map((guard) => (
        <Marker key={guard.id} position={[guard.lat, guard.lng]} icon={guardIcon}>
          <Tooltip>{guard.name}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
