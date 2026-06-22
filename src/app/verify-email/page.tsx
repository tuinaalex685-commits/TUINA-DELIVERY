export const dynamic = 'force-dynamic';

export default function VerifyEmailPage({ searchParams }: { searchParams: { sent?: string, error?: string } }) {
  const isSent = searchParams.sent === "true";
  const error = searchParams.error;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Vérification d'Email
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          
          {isSent && (
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900">Vérifiez votre boîte de réception</h3>
              <p className="mt-2 text-sm text-slate-500">
                Nous vous avons envoyé un email contenant un lien de vérification. 
                Veuillez cliquer sur ce lien pour activer votre compte.
              </p>
              <div className="mt-6">
                <a href="/login" className="text-sm font-medium text-brand-600 hover:text-brand-500">
                  Retour à la connexion
                </a>
              </div>
            </div>
          )}

          {error === "missing_token" && (
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <span className="text-red-600 text-xl font-bold">!</span>
              </div>
              <h3 className="text-lg font-medium text-slate-900">Lien invalide</h3>
              <p className="mt-2 text-sm text-slate-500">Le lien que vous avez suivi ne contient pas de jeton de vérification.</p>
              <div className="mt-6">
                <a href="/login" className="text-sm font-medium text-brand-600 hover:text-brand-500">Retour à la connexion</a>
              </div>
            </div>
          )}

          {error === "invalid_token" && (
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <span className="text-red-600 text-xl font-bold">!</span>
              </div>
              <h3 className="text-lg font-medium text-slate-900">Jeton expiré ou invalide</h3>
              <p className="mt-2 text-sm text-slate-500">Le jeton de vérification n'est plus valide ou ce compte a déjà été activé.</p>
              <div className="mt-6">
                <a href="/login" className="text-sm font-medium text-brand-600 hover:text-brand-500">Retour à la connexion</a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
