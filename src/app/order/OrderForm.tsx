'use client';
import React, { useState } from 'react';
import { MapPin, Package, User, Phone, WalletCards, CreditCard, Box, Navigation, CheckCircle2 } from 'lucide-react';
import { createOrder } from '../actions/orderActions';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-md text-lg font-bold text-white transition-colors ${pending ? 'bg-slate-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500'}`}
    >
      {pending ? 'Création de la commande en cours...' : 'Valider la commande'}
    </button>
  );
}

export default function OrderForm({ agency }: { agency: any }) {
  const searchParams = useSearchParams();
  const agencyId = searchParams.get('agency');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [successData, setSuccessData] = useState<{trackingId: string} | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const result = await createOrder(formData);
    if (result && result.success) {
      setSuccessData({ trackingId: result.trackingId });
    }
  };

  if (successData) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <h1 className="text-xl font-bold text-slate-900">Commande enregistrée</h1>
          </div>
          
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6 space-y-3 font-mono text-sm text-slate-700">
            <p>✅ Votre commande #{successData.trackingId} a été enregistrée</p>
            <p>📦 Statut : En attente de prise en charge</p>
            <p>🔗 Suivi : <a href={`${appUrl}/track/${successData.trackingId}`} className="text-brand-600 hover:underline">{appUrl}/track/{successData.trackingId}</a></p>
          </div>

          <Link href={`/track/${successData.trackingId}`} className="block w-full py-3 text-center rounded-lg font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors">
            Aller sur la page de suivi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{agency?.name || 'Tuina Delivery'}</h1>
          <p className="mt-3 text-lg text-slate-500">
            Créez votre demande de livraison en quelques secondes.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <input type="hidden" name="agencyId" value={agencyId || ''} />
          {/* Anti-Spam Honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="_website">Laissez ce champ vide si vous êtes humain</label>
            <input type="text" id="_website" name="_website" tabIndex={-1} autoComplete="off" />
          </div>

          {/* Section Expéditeur */}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-brand-600 mb-4">
              <User className="w-6 h-6" />
              1. Informations de l'expéditeur
            </h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="senderName" className="block text-sm font-medium text-slate-700">Nom complet</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input type="text" id="senderName" name="senderName" required className="block w-full rounded-md border-slate-300 pl-4 py-3 focus:border-brand-500 focus:ring-brand-500 sm:text-sm border text-slate-900 bg-white" placeholder="Votre nom" />
                </div>
              </div>
              <div>
                <label htmlFor="senderPhone" className="block text-sm font-medium text-slate-700">Numéro de téléphone</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="tel" id="senderPhone" name="senderPhone" required className="block w-full rounded-md border-slate-300 pl-10 py-3 focus:border-brand-500 focus:ring-brand-500 sm:text-sm border text-slate-900 bg-white" placeholder="Ex: 01 23 45 67" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="senderAddress" className="block text-sm font-medium text-slate-700">Adresse de collecte (Départ)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Navigation className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" id="senderAddress" name="senderAddress" required className="block w-full rounded-md border-slate-300 pl-10 py-3 focus:border-brand-500 focus:ring-brand-500 sm:text-sm border text-slate-900 bg-white" placeholder="Quartier, rue, repère..." />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section Destinataire */}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-brand-600 mb-4">
              <MapPin className="w-6 h-6" />
              2. Informations du destinataire
            </h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="receiverName" className="block text-sm font-medium text-slate-700">Nom complet</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input type="text" id="receiverName" name="receiverName" required className="block w-full rounded-md border-slate-300 pl-4 py-3 focus:border-brand-500 focus:ring-brand-500 sm:text-sm border text-slate-900 bg-white" placeholder="Nom du destinataire" />
                </div>
              </div>
              <div>
                <label htmlFor="receiverPhone" className="block text-sm font-medium text-slate-700">Numéro de téléphone</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="tel" id="receiverPhone" name="receiverPhone" required className="block w-full rounded-md border-slate-300 pl-10 py-3 focus:border-brand-500 focus:ring-brand-500 sm:text-sm border text-slate-900 bg-white" placeholder="Ex: 01 23 45 67" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="receiverAddress" className="block text-sm font-medium text-slate-700">Adresse de livraison (Arrivée)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" id="receiverAddress" name="receiverAddress" required className="block w-full rounded-md border-slate-300 pl-10 py-3 focus:border-brand-500 focus:ring-brand-500 sm:text-sm border text-slate-900 bg-white" placeholder="Quartier, rue, repère..." />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section Colis */}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-brand-600 mb-4">
              <Package className="w-6 h-6" />
              3. Détails du colis
            </h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="packageDesc" className="block text-sm font-medium text-slate-700">Description du colis</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                    <Box className="h-5 w-5 text-slate-400" />
                  </div>
                  <textarea id="packageDesc" name="packageDesc" rows={3} className="block w-full rounded-md border-slate-300 pl-10 py-3 focus:border-brand-500 focus:ring-brand-500 sm:text-sm border text-slate-900 bg-white" placeholder="Que contient le colis ? (ex: Documents, Vêtements, Électronique)"></textarea>
                </div>
              </div>
              <div>
                <label htmlFor="packageValue" className="block text-sm font-medium text-slate-700">Valeur déclarée (Optionnel)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 sm:text-sm">FCFA</span>
                  </div>
                  <input type="number" id="packageValue" name="packageValue" className="block w-full rounded-md border-slate-300 pl-16 py-3 focus:border-brand-500 focus:ring-brand-500 sm:text-sm border text-slate-900 bg-white" placeholder="0" />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section Paiement */}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-brand-600 mb-4">
              <WalletCards className="w-6 h-6" />
              4. Mode de paiement
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <input type="hidden" name="paymentMethod" value={paymentMethod} />
              <label 
                className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-colors ${paymentMethod === 'mobile_money' ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                onClick={() => setPaymentMethod('mobile_money')}
              >
                <input type="radio" name="payment" value="mobile_money" className="sr-only" checked={paymentMethod === 'mobile_money'} readOnly />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-slate-900">Orange Money</span>
                    <span className="mt-1 flex items-center text-xs text-slate-500">Paiement par dépôt</span>
                  </span>
                </span>
                <CreditCard className={`h-5 w-5 ${paymentMethod === 'mobile_money' ? 'text-orange-600' : 'text-slate-400'}`} />
              </label>
              
              <label 
                className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-colors ${paymentMethod === 'on_delivery' ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                onClick={() => setPaymentMethod('on_delivery')}
              >
                <input type="radio" name="payment" value="on_delivery" className="sr-only" checked={paymentMethod === 'on_delivery'} readOnly />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-slate-900">À la livraison</span>
                    <span className="mt-1 flex items-center text-xs text-slate-500">Le destinataire paie</span>
                  </span>
                </span>
                <MapPin className={`h-5 w-5 ${paymentMethod === 'on_delivery' ? 'text-brand-600' : 'text-slate-400'}`} />
              </label>

              <label 
                className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-colors ${paymentMethod === 'on_pickup' ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                onClick={() => setPaymentMethod('on_pickup')}
              >
                <input type="radio" name="payment" value="on_pickup" className="sr-only" checked={paymentMethod === 'on_pickup'} readOnly />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-slate-900">À la collecte</span>
                    <span className="mt-1 flex items-center text-xs text-slate-500">Vous payez</span>
                  </span>
                </span>
                <User className={`h-5 w-5 ${paymentMethod === 'on_pickup' ? 'text-brand-600' : 'text-slate-400'}`} />
              </label>
            </div>

            {paymentMethod === 'mobile_money' && (
              <div className="mt-4 p-5 bg-orange-50 border border-orange-200 rounded-lg">
                {agency?.orangeMoneyNumber ? (
                  <>
                    <p className="text-sm text-orange-800 font-medium mb-1">Veuillez effectuer votre dépôt Orange Money sur ce numéro :</p>
                    <p className="text-2xl font-black text-orange-600 tracking-widest mb-4">{agency.orangeMoneyNumber}</p>
                  </>
                ) : (
                  <p className="text-sm text-red-600 font-medium mb-4">Le numéro Orange Money de l'agence n'est pas encore configuré.</p>
                )}
                
                <label htmlFor="transactionId" className="block text-sm font-bold text-slate-700">Numéro de Transaction (ID du SMS)</label>
                <input 
                  type="text" 
                  id="transactionId" 
                  name="transactionId" 
                  required={!!agency?.orangeMoneyNumber}
                  className="mt-1 block w-full rounded-md border-slate-300 px-4 py-3 text-sm border focus:ring-brand-500 focus:border-brand-500 bg-white" 
                  placeholder="Ex: PPXXXXXXXXXX" 
                />
                <p className="text-xs text-slate-500 mt-2">Votre commande ne sera validée qu'après vérification du paiement.</p>
              </div>
            )}
          </div>

          <div className="pt-6">
            <SubmitButton />
            <p className="text-center text-sm text-slate-500 mt-4">En validant, vous acceptez nos conditions générales de livraison.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
