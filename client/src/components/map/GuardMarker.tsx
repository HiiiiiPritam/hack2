import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Guard } from '../../types/index.ts';

interface GuardMarkerProps {
  guard: Guard;
  onSelect: (guard: Guard) => void;
}

export const GuardMarker: React.FC<GuardMarkerProps> = ({ guard, onSelect }) => {
  return (
    <Marker
      position={[guard.location?.lat || 0, guard.location?.lng || 0]}
      eventHandlers={{
        click: () => onSelect(guard),
      }}
    >
      <Popup>
        <div>
          <h3 className="font-bold">{guard.name}</h3>
          <p>Status: {guard.status}</p>
        </div>
      </Popup>
    </Marker>
  );
};