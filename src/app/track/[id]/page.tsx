import React from 'react';
import { CheckCircle2, Circle, Clock, MapPin, Package, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import TrackingMap from '@/components/TrackingMap';

export const dynamic = 'force-dynamic';

export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trackingId = id;

  const order = await prisma.order.findUnique({
    where: { trackingId }
  });

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">Commande introuvable</h1>
        <p className="text-slate-500 mb-8">Vérifiez le lien que vous avez reçu.</p>
        <Link href="/" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold">Retour à l'accueil</Link>
      </div>
    );
  }

  const statusList = [
    "pending",
    "assigned",
    "picked_up",
    "in_delivery",
    "delivered"
  ];
  
  const currentStatusIndex = statusList.indexOf(order.status) !== -1 ? statusList.indexOf(order.status) : 0;

  const steps = [
    { title: 'Commande créée', time: new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), completed: currentStatusIndex >= 0, current: currentStatusIndex === 0, icon: <Package className="w-5 h-5" /> },
    { title: 'Livreur assigné', time: currentStatusIndex >= 1 ? 'OK' : '--:--', completed: currentStatusIndex >= 1, current: currentStatusIndex === 1, icon: <Clock className="w-5 h-5" /> },
    { title: 'Colis récupéré', time: currentStatusIndex >= 2 ? 'OK' : '--:--', completed: currentStatusIndex >= 2, current: currentStatusIndex === 2, icon: <CheckCircle2 className="w-5 h-5" /> },
    { title: 'En livraison', time: currentStatusIndex >= 3 ? 'En cours...' : '--:--', completed: currentStatusIndex >= 3, current: currentStatusIndex === 3, icon: <Truck className="w-5 h-5" /> },
    { title: 'Livré', time: currentStatusIndex >= 4 ? 'OK' : '--:--', completed: currentStatusIndex >= 4, current: currentStatusIndex === 4, icon: <MapPin className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Suivi de commande</h1>
          <p className="mt-2 text-lg text-slate-500 font-mono bg-slate-200 inline-block px-3 py-1 rounded-md">
            #{order.trackingId}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="bg-brand-600 p-6 text-white text-center">
            {currentStatusIndex === 4 ? (
              <>
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-90" />
                <h2 className="text-2xl font-bold">Colis livré !</h2>
                <p className="text-brand-100 mt-1">Merci d'avoir utilisé Tuina Delivery.</p>
              </>
            ) : (
              <>
                <Truck className="w-12 h-12 mx-auto mb-3 opacity-90" />
                <h2 className="text-2xl font-bold">Votre colis est en route !</h2>
                <p className="text-brand-100 mt-1">Suivez sa progression en temps réel.</p>
              </>
            )}
          </div>

          <div className="p-8">
            <h3 className="font-bold text-slate-800 mb-6">Progression</h3>
            
            <div className="relative">
              <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-slate-200"></div>

              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-full border-4 border-white shadow-sm shrink-0
                      ${step.completed && !step.current ? 'bg-brand-500 text-white' : 
                        step.current ? 'bg-white border-2 border-brand-500 text-brand-600 shadow-[0_0_0_4px_rgba(249,115,22,0.2)]' : 
                        'bg-slate-100 text-slate-400'}`}
                    >
                      {step.current ? (
                        <div className="w-3 h-3 rounded-full bg-brand-500 animate-pulse"></div>
                      ) : (
                        step.icon
                      )}
                    </div>

                    <div className="flex-1 pt-2.5">
                      <h4 className={`font-bold ${step.completed || step.current ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.title}
                      </h4>
                      <p className={`text-sm mt-0.5 ${step.current ? 'text-brand-600 font-medium' : 'text-slate-500'}`}>
                        {step.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-8">
            {order.status === 'in_delivery' || order.status === 'picked_up' ? (
              <TrackingMap driverId={order.driverId} />
            ) : null}
          </div>

          <div className="bg-slate-50 p-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Détails du trajet</h3>
            <div className="flex items-center gap-3 text-sm text-slate-700 mb-3">
              <div className="w-8 flex justify-center"><Package className="w-5 h-5 text-slate-400" /></div>
              <div>
                <p className="text-xs text-slate-500">Départ</p>
                <p className="font-medium">{order.senderAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <div className="w-8 flex justify-center"><MapPin className="w-5 h-5 text-brand-500" /></div>
              <div>
                <p className="text-xs text-slate-500">Arrivée</p>
                <p className="font-medium">{order.receiverAddress}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
