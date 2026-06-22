'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function TrackingMap({ driverId }: { driverId: string | null }) {
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);

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
    const interval = setInterval(fetchLocation, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [driverId]);

  if (!driverId) return null;
  if (!location) return (
    <div className="bg-slate-100 h-[300px] w-full rounded-xl flex items-center justify-center text-slate-500 text-sm">
      Recherche de la position du livreur...
    </div>
  );

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Position en direct</h3>
      <MapComponent latitude={location.latitude} longitude={location.longitude} />
    </div>
  );
}
