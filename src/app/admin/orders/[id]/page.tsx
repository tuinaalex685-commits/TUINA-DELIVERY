import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User, MapPin, Package, Phone, CheckCircle2, Copy, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import CopyButton from './CopyButton';
import { assignDriver, updatePaymentStatus } from '@/app/actions/orderActions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trackingId = id;
  
  const session = await getSession();
  if (!session) return redirect('/login');

  const order = await prisma.order.findUnique({
    where: { trackingId },
    include: { driver: true }
  });

  if (!order || (order.agencyId && order.agencyId !== session.agencyId)) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Commande introuvable ou non autorisée</h2>
        <Link href="/admin" className="text-brand-600 hover:underline">Retour au tableau de bord</Link>
      </div>
    );
  }

  const drivers = await prisma.driver.findMany({
    where: { agencyId: session.agencyId },
    orderBy: { createdAt: 'desc' }
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const whatsappMessage = `🚚 Nouvelle mission de livraison #${order.trackingId}
📍 Récupération : ${order.senderAddress}
📍 Livraison : ${order.receiverAddress}
👤 Client : ${order.receiverName}
📞 Contact : ${order.receiverPhone}
👉 Voir mission : ${appUrl}/livreur/${order.trackingId}`;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Commande #{order.trackingId}</h2>
          <span className="inline-flex items-center px-3 py-1 mt-3 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            {order.status === 'pending' && 'Nouvelle commande'}
            {order.status === 'assigned' && 'Assignée'}
            {order.status === 'picked_up' && 'Récupérée'}
            {order.status === 'in_delivery' && 'En livraison'}
            {order.status === 'delivered' && 'Livrée'}
          </span>
          <p className="text-slate-500 text-sm mt-2">Créée le {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        {/* Action Panel for Assigning Driver */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full md:w-96">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Truck className="w-5 h-5 text-brand-600"/> Assignation du Livreur</h3>
          
          <form action={async (formData) => {
            "use server";
            const driverId = formData.get("driverId") as string;
            if (driverId) await assignDriver(order.trackingId, driverId);
          }} className="mb-6 border-b border-slate-100 pb-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Choisir un livreur</label>
            <select 
              name="driverId"
              defaultValue={order.driverId || ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 mb-3"
            >
              <option value="" disabled>Sélectionner un livreur...</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>{driver.name} ({driver.phone})</option>
              ))}
            </select>
            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
              {order.driverId ? "Changer de livreur" : "Assigner la commande"}
            </button>
            {order.driver && (
              <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4"/> Actuellement assigné à {order.driver.name}
              </p>
            )}
          </form>

          <p className="text-sm text-slate-500 mb-4">Envoyez ce message au livreur sur WhatsApp :</p>
          
          <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 font-mono mb-4 whitespace-pre-wrap border border-slate-200 max-h-48 overflow-y-auto">
            {whatsappMessage}
          </div>

          <CopyButton textToCopy={whatsappMessage} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expéditeur */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-brand-600" />
            Expéditeur
          </h3>
          <div className="space-y-3">
            <p className="text-slate-700"><span className="text-slate-500 w-24 inline-block">Nom:</span> <span className="font-medium">{order.senderName}</span></p>
            <p className="text-slate-700 flex items-center gap-2"><span className="text-slate-500 w-24 inline-block">Téléphone:</span> <Phone className="w-4 h-4 text-slate-400"/> <span className="font-medium">{order.senderPhone}</span></p>
            <p className="text-slate-700"><span className="text-slate-500 w-24 inline-block align-top">Adresse:</span> <span className="font-medium inline-block w-2/3">{order.senderAddress}</span></p>
          </div>
        </div>

        {/* Destinataire */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-brand-600" />
            Destinataire
          </h3>
          <div className="space-y-3">
            <p className="text-slate-700"><span className="text-slate-500 w-24 inline-block">Nom:</span> <span className="font-medium">{order.receiverName}</span></p>
            <p className="text-slate-700 flex items-center gap-2"><span className="text-slate-500 w-24 inline-block">Téléphone:</span> <Phone className="w-4 h-4 text-slate-400"/> <span className="font-medium">{order.receiverPhone}</span></p>
            <p className="text-slate-700"><span className="text-slate-500 w-24 inline-block align-top">Adresse:</span> <span className="font-medium inline-block w-2/3">{order.receiverAddress}</span></p>
          </div>
        </div>

        {/* Colis & Paiement */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Package className="w-5 h-5 text-brand-600" />
            Détails du colis et Paiement
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-slate-700"><span className="text-slate-500 w-24 inline-block align-top">Description:</span> <span className="font-medium">{order.packageDesc}</span></p>
              <p className="text-slate-700"><span className="text-slate-500 w-24 inline-block">Valeur:</span> <span className="font-medium">{order.packageValue || 'Non spécifiée'}</span></p>
            </div>
            <div className="space-y-3">
              <p className="text-slate-700"><span className="text-slate-500 w-24 inline-block">Méthode:</span> <span className="font-medium uppercase bg-slate-100 px-2 py-1 rounded text-xs">{order.paymentMethod.replace('_', ' ')}</span></p>
              
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-24 inline-block">Statut:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                  order.paymentStatus === 'Payé' ? 'bg-emerald-100 text-emerald-800' : 
                  order.paymentStatus === 'En attente' ? 'bg-orange-100 text-orange-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>

              {order.transactionId && (
                <p className="text-slate-700"><span className="text-slate-500 w-24 inline-block">ID Transac.:</span> <span className="font-mono text-sm bg-slate-50 px-2 py-1 border border-slate-200 rounded">{order.transactionId}</span></p>
              )}

              {order.paymentMethod === 'mobile_money' && order.paymentStatus !== 'Payé' && (
                <form action={async () => {
                  "use server";
                  await updatePaymentStatus(order.trackingId, "Payé");
                }} className="pt-2">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex justify-center items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Marquer comme payé
                  </button>
                  <p className="text-xs text-slate-500 mt-2 text-center">Assurez-vous d'avoir reçu le dépôt Orange Money avant de valider.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
