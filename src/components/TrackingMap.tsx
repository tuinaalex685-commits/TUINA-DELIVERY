'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function TrackingMap({ driverId, receiverAddress }: { driverId: string | null, receiverAddress?: string }) {
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [destination, setDestination] = useState<{ latitude: number, longitude: number } | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);

  // 1. Fetch destination coordinates from address
  useEffect(() => {
    if (!receiverAddress) return;
    
    const geocode = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(receiverAddress)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setDestination({
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon)
          });
        }
      } catch (error) {
        console.error("Erreur de géocodage:", error);
      }
    };
    geocode();
  }, [receiverAddress]);

  // 2. Fetch driver location
  useEffect(() => {
    if (!driverId) return;

    const fetchLocation = async () => {
      try {
        const res = await fetch(`/api/driver/${driverId}/location`);
        if (res.ok) {
          const data = await res.json();
          if (data.location?.latitude && data.location?.longitude) {
            setLocation({
              latitude: data.location.latitude,
              longitude: data.location.longitude
            });
          }
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);

    return () => clearInterval(interval);
  }, [driverId]);

  // 3. Fetch Route when both locations are known
  useEffect(() => {
    if (!location || !destination) return;

    const fetchRoute = async () => {
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${location.longitude},${location.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          // OSRM returns coordinates as [lon, lat], Leaflet expects [lat, lon]
          const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          setRoute(coords);
        }
      } catch (error) {
        console.error("Erreur de calcul d'itinéraire:", error);
      }
    };

    fetchRoute();
  }, [location, destination]);

  if (!driverId) return null;
  if (!location) return (
    <div className="bg-slate-100 h-[300px] w-full rounded-xl flex items-center justify-center text-slate-500 text-sm">
      Recherche de la position du livreur...
    </div>
  );

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Position en direct</h3>
      <MapComponent 
        latitude={location.latitude} 
        longitude={location.longitude} 
        destination={destination}
        route={route}
      />
    </div>
  );
}
