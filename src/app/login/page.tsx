"use client";

import { useActionState } from "react";
import { loginAction } from "../actions/authActions";
import Link from "next/link";
import { Truck } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await loginAction(formData);
    },
    null
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-brand-100 text-brand-600 p-3 rounded-full mb-4">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Espace Agence</h1>
          <p className="text-slate-500 text-sm mt-1">Connectez-vous pour gérer vos livraisons</p>
        </div>

        {state?.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email professionnel</label>
            <input type="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900 bg-white" placeholder="contact@agence.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <input type="password" name="password" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900 bg-white" placeholder="••••••••" />
          </div>
          
          <button disabled={pending} type="submit" className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${pending ? 'bg-slate-400' : 'bg-brand-600 hover:bg-brand-700'}`}>
            {pending ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Première fois ? <Link href="/signup" className="text-brand-600 hover:underline font-medium">Créer mon agence</Link>
        </p>
      </div>
    </div>
  );
}
