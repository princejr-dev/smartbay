import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Users, AlertCircle, HelpCircle, Clock, CheckCircle,
  ArrowRight, Menu, X, Home, Bell, BookOpen,
  Settings, FolderOpen, FileText, LogOut
} from 'lucide-react';
import { fetchTenants } from '../utils/firestore';
import { formatNumber, getDaysUntilExpiry } from '../utils/helpers';

export default function Dashboard({ onNavigate, user, onLogout }) {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Ferme le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Charge les locataires
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const data = await fetchTenants(user.uid);
        setTenants(data);
      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, [user]);

  // Calculs mémoïsés
  const expired = useMemo(() =>
    tenants.filter(t => getDaysUntilExpiry(t.endDate) < 0),
    [tenants]);

  const expiringSoon = useMemo(() =>
    tenants.filter(t => {
      const d = getDaysUntilExpiry(t.endDate);
      return d >= 0 && d <= 7;
    }), [tenants]);

  const active = useMemo(() =>
    tenants.filter(t => getDaysUntilExpiry(t.endDate) > 7),
    [tenants]);

  const totalRevenue = useMemo(() =>
    tenants.reduce((sum, t) => sum + (t.rent || 0), 0),
    [tenants]);

  // Items du menu hamburger
  const menuItems = [
    { key: 'tenants', icon: Users, label: 'Locataires' },
    { key: 'folders', icon: FolderOpen, label: 'Dossiers' },
    { key: 'receipts', icon: FileText, label: 'Reçus' },
    { key: 'notifications', icon: Bell, label: 'Alertes',
      badge: expired.length + expiringSoon.length },
    { key: 'help', icon: HelpCircle, label: 'Centre d\'aide' },
    { key: 'blog', icon: BookOpen, label: 'Blog SmartBay' },
    { key: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  // Initiale de l'utilisateur
  const initial = user?.displayName
    ? user.displayName[0].toUpperCase()
    : user?.email
    ? user.email[0].toUpperCase()
    : 'P';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pt-8 pb-20">
          <div className="h-8 w-48 bg-white/20 rounded-xl animate-pulse" />
        </div>
        <div className="-mt-12 px-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 mb-5">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-8 w-49 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4">
                <div className="h-10 w-25 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-2" />
                <div className="h-6 w-25 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header gradient */}
      <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pt-10 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-audiowide">SmartBay</h1>

          {/* Menu hamburger */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {menuOpen
                ? <X size={20} className="text-white" />
                : <Menu size={20} className="text-white" />
              }
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">

                {/* Navigation */}
                <div className="py-2">
                  {menuItems.map(({ key, icon: Icon, label, badge }) => (
                    <button
                      key={key}
                      onClick={() => { onNavigate(key); setMenuOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Icon size={16} className="text-accent" />
                        </div>
                        {label}
                      </div>
                      
                      {/* Badge alertes */}
                      {badge > 0 && (
                        <span className="w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                          {badge > 9 ? '9+' : badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Séparateur */}
                <div className="h-px bg-gray-100 dark:bg-gray-700 mx-4" />

                {/* Déconnexion */}
                <button
                  onClick={() => { setShowLogoutModal(true); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <LogOut size={16} className="text-red-500" />
                  </div>
                  Se déconnecter
                </button>

                {/* Modal confirmation logout */}
                {showLogoutModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-sm w-full">
                      <p className="text-base font-semibold text-gray-900 dark:text-white mb-5">
                        Êtes-vous sûr de vouloir vous déconnecter ?
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowLogoutModal(false)}
                          className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => {
                            setShowLogoutModal(false);
                            onLogout();
                          }}
                          className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="text-white/70 text-sm mt-1 font-semibold">
          Gestion locative intelligente
        </p>
      </div>

      {/* Contenu principal */}
      <div className="-mt-12 px-5">

        {/* Carte revenu total */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 mb-5">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Revenus mensuels</p>
          <p className="text-3xl font-bold text-accent">{formatNumber(totalRevenue)}</p>
          <p className="text-gray-400 text-sm">FCFA / mois</p>
        </div>

        {/* Grille de stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{tenants.length}</p>
              <p className="text-xs text-gray-400">Locataires</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{active.length}</p>
              <p className="text-xs text-gray-400">Actifs</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <Clock size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{expiringSoon.length}</p>
              <p className="text-xs text-gray-400">Bientôt</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{expired.length}</p>
              <p className="text-xs text-gray-400">Expirés</p>
            </div>
          </div>
        </div>

        {/* Alertes urgentes */}
        {(expired.length > 0 || expiringSoon.length > 0) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 mb-5">
            <h2 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" />
              Alertes
            </h2>
            {expired.map(t => (
              <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">
                    {t.civility} {t.name}
                  </p>
                  <p className="text-red-500 text-xs mt-0.5">
                    Expiré depuis {Math.abs(getDaysUntilExpiry(t.endDate))} jour{Math.abs(getDaysUntilExpiry(t.endDate)) > 1 ? 's' : ''}
                  </p>
                </div>
                <p className="text-red-500 font-bold text-sm">{formatNumber(t.rent)} FCFA</p>
              </div>
            ))}
            {expiringSoon.map(t => (
              <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">
                    {t.civility} {t.name}
                  </p>
                  <p className="text-orange-500 text-xs mt-0.5">
                    Expire dans {getDaysUntilExpiry(t.endDate)} jour{getDaysUntilExpiry(t.endDate) > 1 ? 's' : ''}
                  </p>
                </div>
                <p className="text-orange-500 font-bold text-sm">{formatNumber(t.rent)} FCFA</p>
              </div>
            ))}
          </div>
        )}

        {/* Lien vers locataires */}
        {tenants.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-accent" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Aucun locataire pour le moment
            </p>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('tenants')}
            className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex items-center justify-between mb-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <Users size={20} className="text-accent" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Voir tous les locataires
              </span>
            </div>
            <ArrowRight size={18} className="text-accent" />
          </button>
        )}
      </div>
    </div>
  );
}