import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  CheckCircle,
  ChevronDown,
  LogOut,
  Mail,
  Moon,
  Search,
  Sun,
  User,
} from 'lucide-react';
import { fetchTenants } from '../utils/firestore';
import { getDaysUntilExpiry } from '../utils/helpers';

const getUserInitial = (user) => {
  if (user?.displayName) {
    return user.displayName[0].toUpperCase();
  }

  if (user?.email) {
    return user.email[0].toUpperCase();
  }

  return 'S';
};

const formatCreationDate = (user) => {
  if (!user?.metadata?.creationTime) {
    return 'Inconnue';
  }

  return new Date(user.metadata.creationTime).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function PCHeader({
  onNavigate,
  theme,
  onThemeChange,
  searchTerm,
  onSearch,
  user,
  onLogout,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [tenants, setTenants] = useState([]);
  const dropdownRef = useRef(null);

  // Le header PC affiche aussi le compteur des baux expirés ou bientôt expirés.
  useEffect(() => {
    const loadTenants = async () => {
      if (!user) return;

      try {
        const data = await fetchTenants(user.uid);
        setTenants(data);
      } catch (err) {
        console.error('Erreur chargement header:', err);
      }
    };

    loadTenants();
  }, [user]);

  // Ferme le dropdown profil quand l'utilisateur clique en dehors.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alertCount = tenants.filter((tenant) => getDaysUntilExpiry(tenant.endDate) <= 7).length;
  const createdAt = formatCreationDate(user);
  const initial = getUserInitial(user);
  const isDarkTheme = theme === 'dark';

  const handleLogoutConfirm = () => {
    setShowLogout(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-50 hidden items-center justify-between border-b border-gray-200 bg-white px-8 py-4 dark:border-gray-700 dark:bg-gray-800 md:flex">
      <div className="flex w-80 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition-colors focus-within:border-accent dark:border-gray-600 dark:bg-gray-700 dark:focus-within:border-accent">
        <Search size={16} className="flex-shrink-0 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un locataire..."
          value={searchTerm}
          onChange={(event) => onSearch(event.target.value)}
          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-300"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onThemeChange(isDarkTheme ? 'light' : 'dark')}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label={isDarkTheme ? 'Activer le thème clair' : 'Activer le thème sombre'}
        >
          {isDarkTheme ? (
            <Sun size={16} className="text-yellow-400" />
          ) : (
            <Moon size={16} className="text-gray-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('notifications')}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="Voir les alertes"
        >
          <Bell size={16} className="text-gray-500 dark:text-gray-400" />
          {alertCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((isOpen) => !isOpen)}
            className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
            aria-label="Ouvrir le menu profil"
            aria-expanded={dropdownOpen}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-dark">
              <span className="text-xs font-bold text-white">{initial}</span>
            </div>

            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              <div className="bg-gradient-to-br from-accent to-accent-dark p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white/40 bg-white/20">
                    <span className="text-lg font-bold text-white">{initial}</span>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      {user?.displayName || 'Propriétaire'}
                    </p>
                    <p className="mt-0.5 max-w-40 truncate text-xs text-white/70">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <User size={14} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Nom</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.displayName || 'Non renseigné'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Mail size={14} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="max-w-44 truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Membre depuis le</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {createdAt}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-700" />

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowLogout(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                >
                  <LogOut size={15} />
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <p className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>

            <div className="flex gap-3 text-center">
              <button
                type="button"
                onClick={() => setShowLogout(false)}
                className="flex-1 rounded-xl bg-gray-200 py-2.5 text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-white transition-colors hover:bg-red-600"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
