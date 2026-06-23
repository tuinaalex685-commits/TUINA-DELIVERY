import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Package, Settings, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/actions/authActions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 relative">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-brand-600">Tuina Admin</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-brand-700 bg-brand-50 rounded-md font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Tableau de bord
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-md font-medium transition-colors">
            <Package className="w-5 h-5" />
            Commandes
          </Link>
          <Link href="/admin/drivers" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-md font-medium transition-colors">
            <Users className="w-5 h-5" />
            Livreurs
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-md font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors">
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center p-3 z-50 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1)]">
        <Link href="/admin" className="flex flex-col items-center text-slate-500 hover:text-brand-600">
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Accueil</span>
        </Link>
        <Link href="/admin/orders" className="flex flex-col items-center text-slate-500 hover:text-brand-600">
          <Package className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Commandes</span>
        </Link>
        <Link href="/admin/drivers" className="flex flex-col items-center text-slate-500 hover:text-brand-600">
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Livreurs</span>
        </Link>
        <Link href="/admin/settings" className="flex flex-col items-center text-slate-500 hover:text-brand-600">
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Réglages</span>
        </Link>
        <form action={logoutAction} className="flex flex-col items-center">
          <button type="submit" className="flex flex-col items-center text-slate-500 hover:text-red-600">
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-1">Quitter</span>
          </button>
        </form>
      </nav>
    </div>
  );
}
