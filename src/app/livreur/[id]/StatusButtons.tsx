'use client';
import React, { useTransition, useEffect, useState } from 'react';
import { Box, Truck, CheckCircle2 } from 'lucide-react';
import { updateOrderStatus } from '@/app/actions/orderActions';
import { useRouter } from 'next/navigation';

export default function StatusButtons({ trackingId, currentStatus, driverId }: { trackingId: string, currentStatus: string, driverId: string | null }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  useEffect(() => {
    let watchId: number;

    if (driverId && (currentStatus === 'picked_up' || currentStatus === 'in_delivery')) {
      setIsSharingLocation(true);
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
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
    } else {
      setIsSharingLocation(false);
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [driverId, currentStatus]);

  const handleUpdate = (newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatus(trackingId, newStatus);
      router.refresh();
      alert(`Statut mis à jour : ${newStatus}`);
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1)]">
      <p className="text-center text-xs text-slate-500 mb-2 font-medium">METTRE À JOUR LE STATUT</p>
      <div className="flex gap-2">
        <button 
          disabled={isPending}
          onClick={() => handleUpdate('picked_up')}
          className={`flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 font-medium text-xs transition-colors ${currentStatus === 'picked_up' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'} ${isPending ? 'opacity-50' : ''}`}
        >
          <Box className="w-5 h-5" />
          Récupéré
        </button>
        <button 
          disabled={isPending}
          onClick={() => handleUpdate('in_delivery')}
          className={`flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 font-medium text-xs transition-colors ${currentStatus === 'in_delivery' ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'} ${isPending ? 'opacity-50' : ''}`}
        >
          <Truck className="w-5 h-5" />
          En route
        </button>
        <button 
          disabled={isPending}
          onClick={() => handleUpdate('delivered')}
          className={`flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 font-medium text-xs transition-colors ${currentStatus === 'delivered' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'} ${isPending ? 'opacity-50' : ''}`}
        >
          <CheckCircle2 className="w-5 h-5" />
          Livré
        </button>
      </div>
    </div>
  );
}
