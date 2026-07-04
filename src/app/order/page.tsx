import { Suspense } from 'react';
export const dynamic = 'force-dynamic';
import { getAgencySettings } from '../actions/settingsActions';
import OrderForm from './OrderForm';

export default async function OrderPage() {
  const agency = await getAgencySettings();

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Chargement...</div>}>
      <OrderForm agency={agency} />
    </Suspense>
  );
}
