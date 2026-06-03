import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { register, loginWithGoogle } from '../utils/auth';

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

  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (!acceptedTerms) {
      setError('Vous devez accepter les CGU et la politique de confidentialité.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(name, email, password);
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Un compte existe déjà avec cet email.');
          break;
        case 'auth/invalid-email':
          setError('Adresse email invalide.');
          break;
        case 'auth/weak-password':
          setError('Mot de passe trop faible.');
          break;
        default:
          setError('Une erreur est survenue. Réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Connexion Google
  const handleGoogle = async () => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">

      {/* Header gradient */}
      <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pt-12 pb-20">
        <button
          onClick={() => onNavigate('login')}
          className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors mb-6"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        
        <div className="flex flex-col items-center">
          <img src="/favicon.png" alt="SmartBay" className="w-14 h-14 mb-3 rounded-xl" />
          <h1 className="font-audiowide text-white text-2xl font-bold">SmartBay</h1>
          <p className="text-white/70 text-sm mt-2 font-semibold">Créez votre compte propriétaire</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-3xl -mt-6 mx-auto px-6 pt-8 pb-10 max-w-md w-full">

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded-xl mb-4">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Nom */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Nom complet</label>
        <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-4 focus-within:border-accent transition-colors">
          <User size={18} className="text-accent flex-shrink-0" />
          <input
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm"
          />
        </div>

        {/* Email */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Email</label>
        <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-4 focus-within:border-accent transition-colors">
          <Mail size={18} className="text-accent flex-shrink-0" />
          <input
            type="email"
            placeholder="exemple@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm"
          />
        </div>

        {/* Mot de passe */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Mot de passe</label>
        <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-4 focus-within:border-accent transition-colors">
          <Lock size={18} className="text-accent flex-shrink-0" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimum 6 caractères"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm"
          />
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword
              ? <EyeOff size={18} className="text-gray-400" />
              : <Eye size={18} className="text-gray-400" />
            }
          </button>
        </div>

        {/* Confirmation */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Confirmer le mot de passe</label>
        <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-5 focus-within:border-accent transition-colors">
          <Lock size={18} className="text-accent flex-shrink-0" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Répétez le mot de passe"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm"
          />
        </div>

        {/* Case à cocher CGU */}
        <div
          onClick={() => setAcceptedTerms(!acceptedTerms)}
          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all mb-5
            ${acceptedTerms
              ? 'border-accent bg-accent/5'
              : 'border-gray-200 dark:border-gray-600'
            }`}
        >
          {/* Checkbox custom */}
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
            ${acceptedTerms
              ? 'bg-accent border-accent'
              : 'border-gray-300 dark:border-gray-500'
            }`}
          >
            {acceptedTerms && (
              <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>

          {/* Texte */}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            J&#39;ai lu et j&#39;accepte les{' '}
            <button
              onClick={(e) => { e.stopPropagation(); onNavigateLegal('terms'); }}
              className="text-accent font-semibold hover:underline"
            >
              Conditions Générales d'Utilisation
            </button>
            {' '}et la{' '}
            <button
              onClick={(e) => { e.stopPropagation(); onNavigateLegal('privacy'); }}
              className="text-accent font-semibold hover:underline"
            >
              Politique de confidentialité
            </button>
            {' '}de SmartBay.
          </p>
        </div>

        {/* Bouton inscription */}
        <button
          onClick={handleRegister}
          disabled={loading || !acceptedTerms}
          className="w-full bg-gradient-to-r from-accent to-accent-dark text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Création du compte...' : 'Créer mon compte'}
        </button>

        {/* Lien connexion */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Déjà un compte ?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-accent font-semibold hover:underline"
          >
            Se connecter
          </button>
        </p>

        {/* Séparateur */}
        <div className="flex items-center gap-3 my-5">
  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
  <span className="text-gray-400 text-xs">ou</span>
  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
</div>

{/* Bouton Google */}
<button
  onClick={handleGoogle}
  disabled={googleLoading || !acceptedTerms}
  className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl py-3.5 font-semibold text-sm text-gray-700 dark:text-gray-300 hover:border-accent hover:bg-accent/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
>
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
  </svg>
  {googleLoading ? 'Connexion...' : 'Continuer avec Google'}
</button>


      </div>
    </div>
  );
}