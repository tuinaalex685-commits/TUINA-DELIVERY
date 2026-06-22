import React from 'react';
import { MapPin, Phone, Package, Box } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import StatusButtons from './StatusButtons';

export const dynamic = 'force-dynamic';

export default async function DriverMissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trackingId = id;
  
  const order = await prisma.order.findUnique({
    where: { trackingId }
  });

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">Mission introuvable</h1>
        <p className="text-slate-500">Veuillez demander à l'agence de renvoyer le lien.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="bg-brand-600 text-white p-6 shadow-md rounded-b-2xl">
        <p className="text-brand-100 text-sm font-medium">Mission de livraison</p>
        <h1 className="text-2xl font-bold mt-1">Commande #{order.trackingId}</h1>
        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-white/20 text-white">
          Statut actuel : {order.status === 'pending' && 'Nouvelle commande'}
          {order.status === 'assigned' && 'Assignée'}
          {order.status === 'picked_up' && 'Récupérée'}
          {order.status === 'in_delivery' && 'En livraison'}
          {order.status === 'delivered' && 'Livrée'}
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4 relative z-10">
        
        {/* Point de collecte */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">1. Collecte</h2>
          <div className="flex gap-4">
            <div className="mt-1 bg-blue-100 p-2 rounded-full h-10 w-10 flex items-center justify-center text-blue-600 shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg leading-tight">{order.senderAddress}</p>
              <p className="text-slate-600 mt-1">{order.senderName}</p>
              <a href={`tel:${order.senderPhone}`} className="inline-flex items-center gap-2 mt-3 text-brand-600 font-medium bg-brand-50 px-3 py-1.5 rounded-lg">
                <Phone className="w-4 h-4" /> Appeler
              </a>
            </div>
          </div>
        </div>

        {/* Point de livraison */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">2. Livraison</h2>
          <div className="flex gap-4">
            <div className="mt-1 bg-emerald-100 p-2 rounded-full h-10 w-10 flex items-center justify-center text-emerald-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg leading-tight">{order.receiverAddress}</p>
              <p className="text-slate-600 mt-1">{order.receiverName}</p>
              <a href={`tel:${order.receiverPhone}`} className="inline-flex items-center gap-2 mt-3 text-brand-600 font-medium bg-brand-50 px-3 py-1.5 rounded-lg">
                <Phone className="w-4 h-4" /> Appeler
              </a>
            </div>
          </div>
        </div>

        {/* Détails du colis */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" /> Détails colis & Paiement
          </h2>
          <div className="space-y-2 text-sm text-slate-700">
            <p><span className="font-medium text-slate-900">Description:</span> {order.packageDesc}</p>
            <p><span className="font-medium text-slate-900">À récupérer:</span> {order.paymentMethod === 'on_delivery' ? order.packageValue || 'Prix de la livraison' : 'Déjà payé ou autre'}</p>
          </div>
        </div>

      </div>

      <StatusButtons trackingId={order.trackingId} currentStatus={order.status} driverId={order.driverId} />
    </div>
  );
}
