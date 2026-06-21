import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) return redirect('/login');

  const orders = await prisma.order.findMany({
    where: { agencyId: session.agencyId },
    orderBy: { createdAt: 'desc' }
  });
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Toutes les commandes</h2>
          <p className="text-slate-500 mt-1">Historique complet de vos livraisons.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td className="py-8 text-center text-slate-500">
                  <p className="mb-4">Aucune commande pour le moment.</p>
                  <Link href="/admin" className="text-brand-600 font-medium hover:underline">
                    Retour au tableau de bord
                  </Link>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{order.trackingId}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link href={`/admin/orders/${order.trackingId}`} className="text-brand-600 font-medium hover:underline">
                      Voir détails
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
