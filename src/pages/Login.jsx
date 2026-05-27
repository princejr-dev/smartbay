import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { login } from '../utils/auth';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation basique
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // La redirection est gérée par onAuthChange dans App.jsx
    } catch (err) {
      // Messages d'erreur Firebase traduits en français
      switch (err.code) {
        case 'auth/user-not-found':
          setError('Aucun compte trouvé avec cet email.');
          break;
        case 'auth/wrong-password':
          setError('Mot de passe incorrect.');
          break;
        case 'auth/invalid-email':
          setError('Adresse email invalide.');
          break;
        case 'auth/too-many-requests':
          setError('Trop de tentatives. Réessayez plus tard.');
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
      <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pt-16 pb-20 flex flex-col items-center">
        <img src="/favicon.png" alt="SmartBay" className="w-16 h-16 mb-4 rounded-xl" />
        <h1 className="font-audiowide text-white text-2xl font-bold">SmartBay</h1>
        <p className="text-white/70 text-sm mt-2">Connexion à votre espace propriétaire</p>
      </div>

      {/* Formulaire */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-3xl -mt-6 mx-auto px-6 pt-8 pb-10 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">Connexion</h2>

        {/* Erreur */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded-xl mb-4">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

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
        <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-6 focus-within:border-accent transition-colors">
          <Lock size={18} className="text-accent flex-shrink-0" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm"
          />
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword
              ? <EyeOff size={18} className="text-gray-400" />
              : <Eye size={18} className="text-gray-400" />
            }
          </button>
        </div>

        {/* Bouton connexion */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent to-accent-dark text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        {/* Lien inscription */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Pas encore de compte ?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-accent font-semibold hover:underline"
          >
            S&#39;inscrire
          </button>
        </p>
      </div>
    </div>
  );
}