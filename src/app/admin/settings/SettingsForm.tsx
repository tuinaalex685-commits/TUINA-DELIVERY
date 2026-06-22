'use client';

import React, { useState } from 'react';
import { updateAgencySettings } from '../actions/settingsActions';

export default function SettingsForm({ agency }: { agency: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await updateAgencySettings(formData);

    if (result.success) {
      setMessage("Paramètres mis à jour avec succès !");
    } else {
      setError(result.error || "Une erreur est survenue");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      
      {message && <div className="p-4 bg-green-50 text-green-700 rounded-lg">{message}</div>}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'agence</label>
        <input 
          type="text" 
          name="name"
          className="w-full border border-slate-300 rounded-lg px-4 py-2" 
          defaultValue={agency?.name || 'Tuina Delivery'} 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Numéro WhatsApp (Contact Client)</label>
        <input 
          type="text" 
          name="whatsappNumber"
          className="w-full border border-slate-300 rounded-lg px-4 py-2" 
          placeholder="Ex: +226..." 
          defaultValue={agency?.whatsappNumber || ''} 
        />
      </div>

      <hr className="border-slate-200" />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Numéro Orange Money (Pour recevoir les paiements)</label>
        <p className="text-xs text-slate-500 mb-2">Les clients verront ce numéro s'ils choisissent de payer par Orange Money.</p>
        <input 
          type="text" 
          name="orangeMoneyNumber"
          className="w-full border border-slate-300 rounded-lg px-4 py-2" 
          placeholder="Ex: 00226 76 XX XX XX" 
          defaultValue={agency?.orangeMoneyNumber || ''} 
        />
      </div>

      <div>
        <button 
          disabled={loading}
          type="submit"
          className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}
