import { useState } from 'react';
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { login, loginWithGoogle, sendPasswordReset } from '../utils/auth';

// Traduit les codes d'erreur Firebase en messages lisibles pour l'utilisateur.
const getLoginErrorMessage = (code) => {
  switch (code) {
    case 'auth/user-not-found':
      return 'Aucun compte trouvé avec cet email.';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect.';
    case 'auth/invalid-email':
      return 'Adresse email invalide.';
    case 'auth/invalid-credential':
      return 'Email ou mot de passe incorrect.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessayez plus tard.';
    default:
      return 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
  }
};

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Connexion classique par email et mot de passe.
  const handleLogin = async (event) => {
    event?.preventDefault();

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(getLoginErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Connexion OAuth via Google, avec un chargement séparé du bouton principal.
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      await loginWithGoogle();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Connexion Google échouée. Réessayez.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Fonction pour gérer la réinitialisation du mot de passe.
const handlePasswordReset = async () => {
  if (!resetEmail) {
    setError('Entrez votre adresse email.');
    return;
  }
  setResetLoading(true);
  setError('');
  try {
    await sendPasswordReset(resetEmail);
    setResetSuccess(true);
  } catch {
    setError('Email introuvable ou erreur. Réessayez.');
  } finally {
    setResetLoading(false);
  }
};

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center bg-gradient-to-br from-accent to-accent-dark px-6 pb-20 pt-16">
        <img src="/favicon.webp" alt="SmartBay" className="mb-4 h-16 w-16 rounded-xl" />
        <h1 className="font-audiowide text-2xl text-white">SmartBay</h1>
        <p className="mt-2 text-sm font-semibold text-white/70">
          Connectez-vous à votre espace propriétaire
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="-mt-6 mx-auto w-full max-w-md flex-1 rounded-t-3xl bg-white px-6 pb-10 pt-8 dark:bg-gray-800"
      >
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800 dark:text-white">
          Connexion
        </h2>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-500 dark:bg-red-900/20">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <label htmlFor="login-email" className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
          Email
        </label>
        <div className="mb-4 flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 transition-colors focus-within:border-accent dark:border-gray-600">
          <Mail size={18} className="flex-shrink-0 text-accent" />
          <input
            id="login-email"
            type="email"
            placeholder="exemple@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="flex-1 bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
          />
        </div>

        <label
          htmlFor="login-password"
          className="mb-2 block text-sm text-gray-500 dark:text-gray-400"
        >
          Mot de passe
        </label>
        <div className="mb-6 flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 transition-colors focus-within:border-accent dark:border-gray-600">
          <Lock size={18} className="flex-shrink-0 text-accent" />
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="flex-1 bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((isVisible) => !isVisible)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-400" />
            ) : (
              <Eye size={18} className="text-gray-400" />
            )}
          </button>
        </div>

        {/* Lien mot de passe oublié */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setResetMode(true)}
            className="text-accent text-sm hover:underline"
          >
          Mot de passe oublié ?
         </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dark py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Pas encore de compte ?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="font-semibold text-accent hover:underline"
          >
            S&apos;inscrire
          </button>
        </p>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-600" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-600" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-accent hover:bg-accent/5 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
            />
            <path
              fill="#34A853"
              d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
            />
            <path
              fill="#FBBC05"
              d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"
            />
            <path
              fill="#EA4335"
              d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"
            />
          </svg>
          {googleLoading ? 'Connexion...' : 'Continuer avec Google'}
        </button>

          {/* Formulaire de réinitialisation du mot de passe */}
          {/* Modal réinitialisation mot de passe */}
{resetMode && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">

      {resetSuccess ? (
        // Succès
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-green-500" />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Email envoyé !</h3>
          <p className="text-gray-400 text-sm mb-4">
            Vérifiez votre boîte mail et suivez les instructions pour réinitialiser votre mot de passe.
          </p>
          <button
            type="button"
            onClick={() => { setResetMode(false); setResetSuccess(false); }}
            className="w-full py-3 bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl font-semibold"
          >
            Fermer
          </button>
        </div>
      ) : (
        // Formulaire
        <>
          <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-center text-xl">
            Mot de passe oublié ?
          </h3>
          <p className="text-gray-400 text-sm mb-4 text-center">
            Entrez votre email et nous vous enverrons un lien de réinitialisation.
          </p>

          <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-4 focus-within:border-accent">
            <Mail size={18} className="text-accent flex-shrink-0" />
            <input
              type="email"
              placeholder="exemple@gmail.com"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setResetMode(false); setError(''); }}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-500 font-semibold hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={resetLoading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {resetLoading ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}
      </form>
    </div>
  );
}
