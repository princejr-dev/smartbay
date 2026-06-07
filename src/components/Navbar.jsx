import { useEffect, useState } from 'react';
import { Bell, Home, Plus, Settings, Users } from 'lucide-react';
import { fetchTenants } from '../utils/firestore';
import { getDaysUntilExpiry } from '../utils/helpers';

const navItems = [
  { key: 'dashboard', icon: Home, label: 'Accueil' },
  { key: 'tenants', icon: Users, label: 'Locataires' },
  { key: 'add', icon: Plus, label: 'Ajouter' },
  { key: 'notifications', icon: Bell, label: 'Alertes' },
  { key: 'settings', icon: Settings, label: 'Paramètres' },
];

export default function Navbar({ activePage, onNavigate, hidden, user }) {
  const [tenants, setTenants] = useState([]);

  // La navbar mobile affiche le nombre de baux expirés ou proches de l'expiration.
  useEffect(() => {
    const loadTenants = async () => {
      if (!user) return;

      try {
        const data = await fetchTenants(user.uid);
        setTenants(data);
      } catch (err) {
        console.error('Erreur chargement navbar:', err);
      }
    };

    loadTenants();
  }, [user]);

  const alertCount = tenants.filter((tenant) => getDaysUntilExpiry(tenant.endDate) <= 7).length;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        hidden ? 'translate-y-full' : 'translate-y-0'
      }`}
      aria-label="Navigation mobile"
    >
      <div className="mx-auto max-w-2xl border-t border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map(({ key, icon: Icon, label }) => {
            const isAddButton = key === 'add';
            const isActive = activePage === key;
            const badge = key === 'notifications' ? alertCount : 0;

            if (isAddButton) {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onNavigate('add')}
                  className="relative -top-6 bg-gradient-to-br from-accent to-accent-dark text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200 flex-shrink-0"
                  style={{ minWidth: '64px', minHeight: '64px' }}
                  aria-label="Ajouter un locataire"
                >
                  <Icon size={30} />
                </button>
              );
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => onNavigate(key)}
                aria-label={label}
                className={`relative flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition-all duration-200 ${
                  isActive ? 'text-accent' : 'text-gray-500 hover:text-accent dark:text-gray-400'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon size={22} />

                  {badge > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>

                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
