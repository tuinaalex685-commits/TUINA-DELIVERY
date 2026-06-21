import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-6">
      <div className="bg-brand-100 text-brand-600 p-4 rounded-full mb-6">
        <Truck className="w-12 h-12" />
      </div>
      <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
        Bienvenue sur <span className="text-brand-600">Tuina Delivery</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mb-8">
        Le logiciel complet pour les agences de livraison. Gérez vos livreurs, suivez vos colis en temps réel et simplifiez la vie de vos clients.
      </p>
      
      <Link 
        href="/login" 
        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white transition-colors bg-brand-600 rounded-full hover:bg-brand-700 shadow-lg hover:shadow-xl"
      >
        Accéder au Dashboard <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
