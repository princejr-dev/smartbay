import { useState } from 'react';
import { AlertCircle, ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { loginWithGoogle, register } from '../utils/auth';

// Traduit les codes d'erreur Firebase en messages lisibles pour l'utilisateur.
const getRegisterErrorMessage = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Un compte existe déjà avec cet email.';
    case 'auth/invalid-email':
      return 'Adresse email invalide.';
    case 'auth/weak-password':
      return 'Mot de passe trop faible.';
    default:
      return 'Une erreur est survenue. Réessayez.';
  }
};

export default function Register({ onNavigate, onNavigateLegal }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Validation locale avant d'appeler Firebase.
  const validateForm = () => {
    if (!name || !email || !password || !confirm) {
      return 'Veuillez remplir tous les champs.';
    }

    if (password !== confirm) {
      return 'Les mots de passe ne correspondent pas.';
    }

    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    }

    if (!acceptedTerms) {
      return 'Vous devez accepter les CGU et la politique de confidentialité.';
    }

    return '';
  };

  // Création du compte avec email, mot de passe et nom complet.
  const handleRegister = async (event) => {
    event?.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(name, email, password);
    } catch (err) {
      setError(getRegisterErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Google est autorisé seulement après acceptation des CGU.
  const handleGoogleLogin = async () => {
    if (!acceptedTerms) {
      setError('Vous devez accepter les CGU avant de continuer.');
      return;
    }

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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pb-20 pt-12">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="mb-6 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 transition-colors hover:bg-white/30"
          aria-label="Retour à la connexion"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>

        <div className="flex flex-col items-center">
          <img src="/favicon.webp" alt="SmartBay" className="mb-3 h-14 w-14 rounded-xl" />
          <h1 className="font-audiowide text-2xl font-bold text-white">SmartBay</h1>
          <p className="mt-2 text-sm font-semibold text-white/70">
            Créez votre compte propriétaire
          </p>
        </div>
      </div>

      <form
        onSubmit={handleRegister}
        className="-mt-6 mx-auto w-full max-w-md flex-1 rounded-t-3xl bg-white px-6 pb-10 pt-8 dark:bg-gray-800"
      >
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-500 dark:bg-red-900/20">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <label
          htmlFor="register-name"
          className="mb-2 block text-sm text-gray-500 dark:text-gray-400"
        >
          Nom complet
        </label>
        <div className="mb-4 flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 transition-colors focus-within:border-accent dark:border-gray-600">
          <User size={18} className="flex-shrink-0 text-accent" />
          <input
            id="register-name"
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="flex-1 bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
          />
        </div>

        <label
          htmlFor="register-email"
          className="mb-2 block text-sm text-gray-500 dark:text-gray-400"
        >
          Email
        </label>
        <div className="mb-4 flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 transition-colors focus-within:border-accent dark:border-gray-600">
          <Mail size={18} className="flex-shrink-0 text-accent" />
          <input
            id="register-email"
            type="email"
            placeholder="exemple@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="flex-1 bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
          />
        </div>

        <label
          htmlFor="register-password"
          className="mb-2 block text-sm text-gray-500 dark:text-gray-400"
        >
          Mot de passe
        </label>
        <div className="mb-4 flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 transition-colors focus-within:border-accent dark:border-gray-600">
          <Lock size={18} className="flex-shrink-0 text-accent" />
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimum 6 caractères"
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

        <label
          htmlFor="register-confirm"
          className="mb-2 block text-sm text-gray-500 dark:text-gray-400"
        >
          Confirmer le mot de passe
        </label>
        <div className="mb-5 flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 transition-colors focus-within:border-accent dark:border-gray-600">
          <Lock size={18} className="flex-shrink-0 text-accent" />
          <input
            id="register-confirm"
            type={showPassword ? 'text' : 'password'}
            placeholder="Répétez le mot de passe"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className="flex-1 bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
          />
        </div>

        <div
          className={`mb-5 flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${
            acceptedTerms ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-gray-600'
          }`}
          onClick={() => setAcceptedTerms((isAccepted) => !isAccepted)}
          role="checkbox"
          aria-checked={acceptedTerms}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setAcceptedTerms((isAccepted) => !isAccepted);
            }
          }}
        >
          <div
            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
              acceptedTerms ? 'border-accent bg-accent' : 'border-gray-300 dark:border-gray-500'
            }`}
          >
            {acceptedTerms && (
              <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true">
                <path
                  d="M1 4L4.5 7.5L11 1"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            )}
          </div>

          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            J&apos;ai lu et j&apos;accepte les{' '}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onNavigateLegal('terms');
              }}
              className="font-semibold text-accent hover:underline"
            >
              Conditions Générales d&apos;Utilisation
            </button>{' '}
            et la{' '}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onNavigateLegal('privacy');
              }}
              className="font-semibold text-accent hover:underline"
            >
              Politique de confidentialité
            </button>{' '}
            de SmartBay.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !acceptedTerms}
          className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dark py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Création du compte...' : 'Créer mon compte'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Déjà un compte ?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-semibold text-accent hover:underline"
          >
            Se connecter
          </button>
        </p>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-600" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-600" />
        </div>

        {/* Connexion avec Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || !acceptedTerms}
          className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-accent hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
        >
          <svg width="24" height="24" viewBox="0 0 18 18" aria-hidden="true">
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
      </form>
    </div>
  );
}
