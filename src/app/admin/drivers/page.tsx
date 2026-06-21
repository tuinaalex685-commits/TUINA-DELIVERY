import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { addDriver, deleteDriver } from '@/app/actions/driverActions';
import { Trash2, UserPlus } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DriversPage() {
  const session = await getSession();
  if (!session) return redirect('/login');

  const drivers = await prisma.driver.findMany({
    where: { agencyId: session.agencyId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Livreurs</h2>
          <p className="text-slate-500 mt-1">Gérez votre flotte de livreurs.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ajouter un livreur */}
        <div className="md:col-span-1">
          <form action={addDriver} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-600" />
              Nouveau livreur
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                <input type="text" name="name" required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:border-brand-500 focus:ring-brand-500" placeholder="Ex: Ali Ouedraogo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone (WhatsApp)</label>
                <input type="text" name="phone" required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:border-brand-500 focus:ring-brand-500" placeholder="Ex: 70 12 34 56" />
              </div>
              <button type="submit" className="w-full bg-brand-600 text-white font-bold py-2 rounded-lg hover:bg-brand-700 transition-colors">
                Ajouter
              </button>
            </div>
          </form>
        </div>

        {/* Liste des livreurs */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-6 text-sm font-semibold text-slate-600">Nom</th>
                  <th className="py-3 px-6 text-sm font-semibold text-slate-600">Téléphone</th>
                  <th className="py-3 px-6 text-sm font-semibold text-slate-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {drivers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500">
                      Aucun livreur pour le moment.
                    </td>
                  </tr>
                ) : (
                  drivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-slate-50">
                      <td className="py-4 px-6 font-medium text-slate-900">{driver.name}</td>
                      <td className="py-4 px-6 text-slate-600">{driver.phone}</td>
                      <td className="py-4 px-6 text-right">
                        <form action={async () => {
                          "use server";
                          await deleteDriver(driver.id);
                        }}>
                          <button type="submit" className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
