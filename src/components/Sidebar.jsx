import { Home, Users, Bell, Settings, FileText, LogOut, FolderOpen  } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ activePage, onNavigate, onLogout }) {
  const navItems = [
    { key: 'dashboard', icon: Home, label: 'Dashboard' },
    { key: 'tenants', icon: Users, label: 'Locataires' },
    { key: 'folders', icon: FolderOpen, label: 'Dossiers' },
    { key: 'receipts', icon: FileText, label: 'Reçus' },
    { key: 'notifications', icon: Bell, label: 'Alertes' },
  ];

  const [showLogout, setShowLogout] = useState(false);

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100 dark:border-gray-700">
        <img src="/favicon.png" alt="SmartBay" className="w-8 h-8" />
        <span className="font-audiowide font-bold text-accent text-lg">SmartBay</span>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {navItems.map(({ key, icon: Icon, label }) => {
          const isActive = activePage === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left
                ${isActive
                  ? 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-md shadow-accent/30'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-accent'
                }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer sidebar — Paramètres + Déconnexion */}
      <div className="px-4 pb-6 flex flex-col gap-1 border-t border-gray-100 dark:border-gray-700 pt-4">
        {/* Paramètres */}
        <button
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left
            ${activePage === 'settings'
              ? 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-md shadow-accent/30'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-accent'
            }`}
        >
          <Settings size={18} />
          Paramètres
        </button>

        {/* Déconnexion */}
        <button
          onClick={() => setShowLogout(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={15} />
          Se déconnecter
        </button>

        {/* Modal confirmation logout */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-sm">

            <p className="text-base font-semibold text-gray-900 dark:text-white mb-5">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>

            <div className="flex gap-3 text-center">

              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>

              <button
                onClick={() => {
                  setShowLogout(false);
                  onLogout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Déconnexion
              </button>

            </div>

          </div>

        </div>
      )}

        {/* Version */}
        <p className="text-xs text-gray-400 px-4 mt-2">SmartBay v1.0.0</p>
      </div>
    </aside>
  );
}