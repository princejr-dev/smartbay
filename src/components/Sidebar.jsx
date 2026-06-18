import { useState } from 'react';
import { Bell, FileText, FolderOpen, Home, LogOut, Settings, Users } from 'lucide-react';

const navItems = [
  { key: 'dashboard', icon: Home, label: 'Dashboard' },
  { key: 'tenants', icon: Users, label: 'Locataires' },
  { key: 'folders', icon: FolderOpen, label: 'Dossiers' },
  { key: 'receipts', icon: FileText, label: 'Reçus' },
  { key: 'notifications', icon: Bell, label: 'Alertes' },
];

const getNavButtonClassName = (isActive) => (
  `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-md shadow-accent/30'
      : 'text-gray-500 hover:bg-gray-100 hover:text-accent dark:text-gray-400 dark:hover:bg-gray-700'
  }`
);

export default function Sidebar({ activePage, onNavigate, onLogout }) {
  const [showLogout, setShowLogout] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogout(false);
    onLogout();
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-60 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 md:flex">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-6 dark:border-gray-700">
        <img src="/favicon.webp" alt="SmartBay" className="h-8 w-8 rounded" />
        <span className="font-audiowide text-lg font-bold text-accent">SmartBay</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-6" aria-label="Navigation principale">
        {navItems.map(({ key, icon: Icon, label }) => {
          const isActive = activePage === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              className={getNavButtonClassName(isActive)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-gray-100 px-4 pb-6 pt-4 dark:border-gray-700">
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className={getNavButtonClassName(activePage === 'settings')}
          aria-current={activePage === 'settings' ? 'page' : undefined}
        >
          <Settings size={18} />
          Paramètres
        </button>

        <button
          type="button"
          onClick={() => setShowLogout(true)}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={15} />
          Se déconnecter
        </button>

        <p className="mt-2 px-4 text-xs text-gray-400">SmartBay v1.1.3</p>
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
    </aside>
  );
}
