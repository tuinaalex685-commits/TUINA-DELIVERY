'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue in Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Destination icon (different color)
const destIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map center and bounds
function MapUpdater({ route, driverPos }: { route: [number, number][], driverPos: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [20, 20], animate: true });
    } else {
      map.setView(driverPos, map.getZoom(), { animate: true });
    }
  }, [route, driverPos, map]);
  return null;
}

interface MapComponentProps {
  latitude: number;
  longitude: number;
  destination: { latitude: number, longitude: number } | null;
  route: [number, number][];
}

export default function MapComponent({ latitude, longitude, destination, route }: MapComponentProps) {
  const driverPos: [number, number] = [latitude, longitude];

  return (
    <div style={{ height: '350px', width: '100%', borderRadius: '0.75rem', overflow: 'hidden', zIndex: 0, position: 'relative' }}>
      <MapContainer center={driverPos} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Ligne d'itinéraire */}
        {route && route.length > 0 && (
          <Polyline positions={route} color="#3b82f6" weight={5} opacity={0.7} />
        )}

        {/* Marqueur du livreur */}
        <Marker position={driverPos} icon={customIcon}>
          <Popup>Livreur</Popup>
        </Marker>

        {/* Marqueur de destination */}
        {destination && (
          <Marker position={[destination.latitude, destination.longitude]} icon={destIcon}>
            <Popup>Destination (Client)</Popup>
          </Marker>
        )}

        <MapUpdater route={route} driverPos={driverPos} />
      </MapContainer>
    </div>
  );
}
