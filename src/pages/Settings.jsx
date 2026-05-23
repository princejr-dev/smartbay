import { useState } from 'react';
import { ArrowLeft, Moon, Bell, Server, Info, Trash2, ChevronRight } from 'lucide-react';
import { loadSettings, saveSettings, loadTenants, clearAll } from '../utils/storage';

export default function Settings({ onBack, onThemeChange }) {
  // Initialisation lazy — chargé une seule fois au montage
const [settings, setSettings] = useState(() => loadSettings());
const [tenantCount, setTenantCount] = useState(() => loadTenants().length);

  // Met à jour un paramètre et sauvegarde
  const update = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettings(updated);

    // Propage le changement de thème vers App.jsx
    if (key === 'theme') {
      onThemeChange(value);
    }
  };

  // Supprime toutes les données
  const handleClearData = () => {
    if (window.confirm('Toutes vos données seront supprimées. Cette action est irréversible.')) {
      clearAll();
      setTenantCount(0);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header avec bouton retour */}
      <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pt-12 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold">Paramètres</h1>
        </div>
      </div>

      <div className="px-5 pt-5 pb-10">

        {/* Apparence */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Apparence</p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-5 overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {/* Icône mode sombre */}
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <Moon size={18} className="text-accent" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">Mode sombre</p>
                <p className="text-xs text-gray-400">Thème sombre</p>
              </div>
            </div>
            {/* Toggle switch */}
            <button
              onClick={() => update('theme', settings.theme === 'dark' ? 'light' : 'dark')}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300
                ${settings.theme === 'dark' ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 flex bg-white rounded-full shadow transition-transform duration-300
                ${settings.theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Notifications</p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-5 overflow-hidden">

          {/* Activer/désactiver */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                <Bell size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">Notifications</p>
                <p className="text-xs text-gray-400">Alertes de loyers</p>
              </div>
            </div>
            <button
              onClick={() => update('notifications', !settings.notifications)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300
                ${settings.notifications ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 flex bg-white rounded-full shadow transition-transform duration-300
                ${settings.notifications ? 'translate-x-6' : 'translate-x-0.5'}`}
              />
            </button>
          </div>

          {/* Jours de rappel */}
          <div className="p-4">
            <p className="font-semibold text-gray-800 dark:text-white text-sm mb-3">
              Rappel avant expiration
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 7].map(d => (
                <button
                  key={d}
                  onClick={() => update('reminderDays', d)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all
                    ${settings.reminderDays === d
                      ? 'bg-accent border-accent text-white'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                    }`}
                >
                  {d}j
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Données */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Données</p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-5 overflow-hidden">

          {/* Données stockées */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <Server size={18} className="text-accent" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">Données stockées</p>
                <p className="text-xs text-gray-400">{tenantCount} locataire{tenantCount > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Supprimer les données */}
          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-red-500 text-sm">Supprimer les données</p>
                <p className="text-xs text-gray-400">Action irréversible</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>

        {/* À propos */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">À propos</p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <Info size={18} className="text-accent" />
              </div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">Version</p>
            </div>
            <span className="text-gray-400 text-sm">1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}