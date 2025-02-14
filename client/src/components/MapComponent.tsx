import React from "react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";

const socket = io("http://localhost:5000");

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapComponent = () => {
  const [guards, setGuards] = useState<{ id: number; lat: number; lng: number }[]>([]);

  useEffect(() => {
    socket.on("guardLocations", (data) => {
      setGuards(data);
    });

    return () => {
      socket.off("guardLocations");
    };
  }, []);

  return (
    <MapContainer center={[28.6139, 77.209]} zoom={6} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
      />
      {guards.map((guard) => (
        <Marker key={guard.id} position={[guard.lat, guard.lng]} icon={customIcon}>
          <Popup>Guard {guard.id}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
