import { Home, Users, Plus, Bell, Settings } from 'lucide-react';
import { loadTenants } from '../utils/storage';
import { getDaysUntilExpiry } from '../utils/helpers';

export default function Navbar({ activePage, onNavigate, hidden }) {
  // Calcule le nombre d'alertes (expirés + bientôt)
  const tenants = loadTenants();
  const alertCount = tenants.filter(t => getDaysUntilExpiry(t.endDate) <= 7).length;

  const navItems = [
    { key: 'dashboard', icon: Home, label: 'Accueil' },
    { key: 'tenants', icon: Users, label: 'Locataires' },
    { key: 'add', icon: Plus, label: '' },
    { key: 'notifications', icon: Bell, label: 'Alertes', badge: alertCount },
    { key: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${hidden ? 'translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="flex justify-around items-center px-4 py-2">
          {navItems.map(({ key, icon: Icon, label, badge }) => {

            // Bouton + circulaire flottant
            if (key === 'add') {
              return (
                <button
                  key={key}
                  onClick={() => onNavigate('add')}
                  className="relative -top-6 bg-gradient-to-br from-accent to-accent-dark text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200 flex-shrink-0"
                  style={{ minWidth: '64px', minHeight: '64px' }}
                >
                  <Icon size={30} />
                </button>
              );
            }

            const isActive = activePage === key;
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200
                  ${isActive ? 'text-accent' : 'text-gray-400 dark:text-gray-500 hover:text-accent'}`}
              >
                <div className="relative">
                  <Icon size={22} />
                  {/* Badge rouge si alertes disponibles */}
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                {label && <span className="text-xs font-medium">{label}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}