import React from 'react';
import Link from 'next/link';
import { Search, Filter, MoreVertical, Eye, Truck, ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) return redirect('/login');

  const orders = await prisma.order.findMany({
    where: { agencyId: session.agencyId },
    orderBy: { createdAt: 'desc' },
  });

  const newOrdersCount = orders.filter((o: any) => o.status === "pending").length;
  const inProgressCount = orders.filter((o: any) => ["assigned", "picked_up", "in_delivery"].includes(o.status)).length;
  const deliveredCount = orders.filter((o: any) => o.status === "delivered").length;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const orderLink = `${appUrl}/order?agency=${session.agencyId}`;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tableau de bord</h2>
          <p className="text-slate-500 mt-1">Gérez vos livraisons et suivez vos livreurs.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher une commande..." 
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Lien Public Client */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-brand-900 flex items-center gap-2">
            🔗 Lien de votre formulaire de commande
          </h3>
          <p className="text-brand-700 text-sm mt-1">Envoyez ce lien à vos clients (par WhatsApp ou QR Code) pour qu'ils remplissent leurs informations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={orderLink} target="_blank" className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-brand-200 text-brand-800 text-sm font-mono font-medium hover:bg-brand-100 transition-colors truncate max-w-sm">
            {orderLink}
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
          </Link>
          <button className="px-4 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors text-sm">
            Copier
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm">Nouvelles commandes</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{newOrdersCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm">En cours</h3>
          <p className="text-3xl font-bold text-brand-600 mt-2">{inProgressCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm">Livrées</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{deliveredCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm">Total commandes</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{orders.length}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Commandes récentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="py-3 px-6 text-sm font-semibold text-slate-600">ID & Date</th>
                <th className="py-3 px-6 text-sm font-semibold text-slate-600">Trajet</th>
                <th className="py-3 px-6 text-sm font-semibold text-slate-600">Statut</th>
                <th className="py-3 px-6 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    Aucune commande pour le moment. <br/>
                    <span className="text-sm">Partagez votre lien public pour recevoir des demandes.</span>
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{order.trackingId}</p>
                      <p className="text-xs text-slate-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{order.senderAddress}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{order.receiverAddress}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {order.status === 'pending' && 'Nouvelle commande'}
                        {order.status === 'assigned' && 'Assignée'}
                        {order.status === 'picked_up' && 'Récupérée'}
                        {order.status === 'in_delivery' && 'En livraison'}
                        {order.status === 'delivered' && 'Livrée'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link href={`/admin/orders/${order.trackingId}`} className="text-brand-600 hover:text-brand-900 font-medium text-sm flex items-center justify-end gap-1">
                        Gérer <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
