'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Navigation } from 'lucide-react';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

interface DriverMapProps {
  driverId: string | null;
  currentStatus: string;
  senderAddress: string;
  receiverAddress: string;
}

export default function DriverMap({ driverId, currentStatus, senderAddress, receiverAddress }: DriverMapProps) {
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [targetDestination, setTargetDestination] = useState<{ latitude: number, longitude: number } | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);

  // Déterminer l'adresse cible en fonction du statut
  // Si le colis n'est pas encore récupéré, on va vers l'expéditeur. Sinon, on va vers le client.
  const targetAddress = (currentStatus === 'pending' || currentStatus === 'assigned') ? senderAddress : receiverAddress;
  const isGoingToSender = (currentStatus === 'pending' || currentStatus === 'assigned');

  // 1. Suivi GPS du livreur et envoi au serveur
  useEffect(() => {
    let watchId: number;

    if (driverId) {
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            
            // Envoi de la position au serveur (pour le suivi client)
            try {
              await fetch(`/api/driver/${driverId}/location`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ latitude, longitude }),
              });
            } catch (error) {
              console.error("Erreur d'envoi de la position:", error);
            }
          },
          (error) => {
            console.error("Erreur GPS:", error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [driverId]);

  // 2. Géocodage de l'adresse cible
  useEffect(() => {
    if (!targetAddress) return;
    
    const geocode = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(targetAddress)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setTargetDestination({
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon)
          });
        }
      } catch (error) {
        console.error("Erreur de géocodage:", error);
      }
    };
    geocode();
  }, [targetAddress]);

  // 3. Calcul de l'itinéraire OSRM
  useEffect(() => {
    if (!location || !targetDestination) return;

    const fetchRoute = async () => {
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${location.longitude},${location.latitude};${targetDestination.longitude},${targetDestination.latitude}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          setRoute(coords);
        }
      } catch (error) {
        console.error("Erreur de calcul d'itinéraire:", error);
      }
    };

    fetchRoute();
  }, [location, targetDestination]);

  if (!driverId) return null;

  return (
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Navigation</h3>
          <p className="text-sm font-medium text-slate-800">
            {isGoingToSender ? 'Vers le point de collecte' : 'Vers le point de livraison'}
          </p>
        </div>
        
        {location && targetDestination && (
          <a 
            href={`https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${targetDestination.latitude},${targetDestination.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Ouvrir GPS
          </a>
        )}
      </div>

      {!location ? (
        <div className="bg-slate-100 h-[250px] w-full rounded-xl flex items-center justify-center text-slate-500 text-sm">
          Acquisition du signal GPS...
        </div>
      ) : (
        <MapComponent 
          latitude={location.latitude} 
          longitude={location.longitude} 
          destination={targetDestination}
          route={route}
        />
      )}
    </div>
  );
}
