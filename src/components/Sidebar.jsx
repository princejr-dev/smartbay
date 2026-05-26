import { Home, Users, Bell, Settings, FileText } from 'lucide-react';

export default function Sidebar({ activePage, onNavigate }) {
  const navItems = [
    { key: 'dashboard', icon: Home, label: 'Dashboard' },
    { key: 'tenants', icon: Users, label: 'Locataires' },
    { key: 'notifications', icon: Bell, label: 'Alertes' },
    { key: 'receipts', icon: FileText, label: 'Reçus' },
    { key: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100 dark:border-gray-700">
        <img src="/favicon.png" alt="SmartBay" className="w-8 h-8 rounded" />
        <span className="font-audiowide font-bold text-accent text-lg">SmartBay</span>
      </div>

      {/* Navigation */}
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

      {/* Footer sidebar */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400">SmartBay v.0.3.0</p>
        <p className="text-xs text-gray-400">Gestion locative</p>
      </div>
    </aside>
  );
}