import { Search, Bell, Moon, Sun } from 'lucide-react';
import { loadTenants } from '../utils/storage';
import { getDaysUntilExpiry } from '../utils/helpers';

export default function PCHeader({ onNavigate, theme, onThemeChange, searchTerm, onSearch }) {
  // Calcule le nombre d'alertes
  const tenants = loadTenants();
  const alertCount = tenants.filter(t => getDaysUntilExpiry(t.endDate) <= 7).length;

  return (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">

      {/* Barre de recherche */}
      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 w-80 focus-within:border-accent dark:focus-within:border-accent transition-colors">
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

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center cursor-pointer">
          <span className="text-white text-sm font-bold">S</span>
        </div>

      </div>
    </header>
  );
}