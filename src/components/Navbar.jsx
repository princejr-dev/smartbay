import { Home, Users, Plus, Bell, Settings } from 'lucide-react';

export default function Navbar({ activePage, onNavigate, hidden }) {
  // Boutons de la barre de navigation
  const navItems = [
    { key: 'dashboard', icon: Home, label: 'Accueil' },
    { key: 'tenants', icon: Users, label: 'Locataires' },
    { key: 'add', icon: Plus, label: '' }, // Bouton central +
    { key: 'notifications', icon: Bell, label: 'Alertes' },
    { key: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${hidden ? 'translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="flex justify-around items-center px-4 py-2">
          {navItems.map(({ key, icon: Icon, label }) => {
            // Bouton + circulaire flottant au centre
            if (key === 'add') {
                return (
                <button
                 key={key}
                 onClick={() => onNavigate('add')}
                 className="relative -top-5 bg-gradient-to-br from-accent to-accent-dark text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                 <Icon size={28} />
                </button>
                );
            }

            // Boutons normaux
            const isActive = activePage === key;
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'text-accent'
                    : 'text-gray-400 dark:text-gray-500 hover:text-accent'
                  }`}
              >
                <Icon size={22} />
                {label && (
                  <span className="text-xs font-medium">{label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}