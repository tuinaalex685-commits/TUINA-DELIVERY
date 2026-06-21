import React from 'react';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Paramètres</h2>
        <p className="text-slate-500 mt-1">Configurez votre agence de livraison.</p>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'agence</label>
          <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2" defaultValue="Tuina Delivery" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Numéro WhatsApp</label>
          <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2" placeholder="Ex: +226..." />
        </div>
        <div>
          <button className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
