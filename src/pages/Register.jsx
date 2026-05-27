import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { register } from '../utils/auth';

export default function Register({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validations
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

    setLoading(true);
    setError('');

    try {
      await register(name, email, password);
      // La redirection est gérée par onAuthChange dans App.jsx
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
          <p className="text-white/70 text-sm mt-2">Créez votre compte propriétaire</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-3xl -mt-6 mx-auto px-6 pt-8 pb-10 max-w-md w-full">

        {/* Erreur */}
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

        {/* Confirmation mot de passe */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Confirmer le mot de passe</label>
        <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-6 focus-within:border-accent transition-colors">
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

        {/* Bouton inscription */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent to-accent-dark text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
}