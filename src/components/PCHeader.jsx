import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Moon, Sun, LogOut, User, Mail, ChevronDown } from 'lucide-react';
import { loadTenants } from '../utils/storage';
import { getDaysUntilExpiry } from '../utils/helpers';

export default function PCHeader({ onNavigate, theme, onThemeChange, searchTerm, onSearch, user, onLogout }) {
  const tenants = loadTenants();
  const alertCount = tenants.filter(t => getDaysUntilExpiry(t.endDate) <= 7).length;

  // État du dropdown profil
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ferme le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initiale de l'utilisateur
  const initial = user?.displayName
    ? user.displayName[0].toUpperCase()
    : user?.email
    ? user.email[0].toUpperCase()
    : 'P';

  // Date d'inscription Firebase
  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : 'Inconnue';

  return (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">

      {/* Barre de recherche */}
      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 w-80 focus-within:border-accent transition-colors">
        <Search size={16} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Rechercher un locataire..."
          value={searchTerm}
          onChange={e => onSearch(e.target.value)}
          className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 w-full"
        />
      </div>

      {/* Actions droite */}
      <div className="flex items-center gap-3">

        {/* Toggle thème */}
        <button
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === 'dark'
            ? <Sun size={16} className="text-yellow-400" />
            : <Moon size={16} className="text-gray-500" />
          }
        </button>

        {/* Alertes */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <Bell size={16} className="text-gray-500 dark:text-gray-400" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </button>

        {/* Profil dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
              <span className="text-white text-xs font-bold">{initial}</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-28 truncate">
              {user?.displayName || 'Propriétaire'}
            </span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">

              {/* En-tête profil */}
              <div className="bg-gradient-to-br from-accent to-accent-dark p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 border-2 border-white/40 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">{initial}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      {user?.displayName || 'Propriétaire'}
                    </p>
                    <p className="text-white/70 text-xs mt-0.5 truncate max-w-40">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Infos détaillées */}
              <div className="p-4 flex flex-col gap-3">

                {/* Email */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-44">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Nom */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Nom complet</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.displayName || 'Non renseigné'}
                    </p>
                  </div>
                </div>

                {/* Date inscription */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-500 text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Membre depuis</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {createdAt}
                    </p>
                  </div>
                </div>

                {/* Séparateur */}
                <div className="h-px bg-gray-100 dark:bg-gray-700" />

                {/* Bouton déconnexion */}
                <button
                  onClick={() => { setDropdownOpen(false); onLogout(); }}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-500 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                  <LogOut size={15} />
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}