import React from 'react';
import SettingsForm from './SettingsForm';
import { getAgencySettings } from '../../actions/settingsActions';

export default async function SettingsPage() {
  const agency = await getAgencySettings();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Paramètres</h2>
        <p className="text-slate-500 mt-1">Configurez votre agence et vos moyens de paiement.</p>
      </div>
      
      <SettingsForm agency={agency} />
    </div>
  );
}
