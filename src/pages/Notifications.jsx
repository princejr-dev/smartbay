import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { fetchTenants } from '../utils/firestore';
import { formatDate, formatNumber, getDaysUntilExpiry } from '../utils/helpers';

// Carte de notification individuelle — définie en dehors du composant
function NotifCard({ tenant, type }) {
  const days = getDaysUntilExpiry(tenant.endDate);

  const config = {
    expired: {
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-l-red-500',
      icon: AlertCircle,
      label: `Expiré depuis ${Math.abs(days)} jour${Math.abs(days) > 1 ? 's' : ''}`,
    },
    soon: {
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-l-orange-500',
      icon: Clock,
      label: `Expire dans ${days} jour${days > 1 ? 's' : ''}`,
    },
    upcoming: {
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-l-green-500',
      icon: Calendar,
      label: `Dans ${days} jours — ${formatDate(tenant.endDate)}`,
    },
  }[type];

  const Icon = config.icon;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-l-4 ${config.border} p-4 mb-3 flex items-center gap-4`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
        <Icon size={22} className={config.color} />
      </div>
      <div className="flex-1">
        <p className="font-bold text-gray-800 dark:text-white text-sm">
          {tenant.civility} {tenant.name}
        </p>
        <p className={`text-xs mt-0.5 font-medium ${config.color}`}>{config.label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatNumber(tenant.rent)} FCFA/mois</p>
      </div>
    </div>
  );
}

// Section avec titre — définie en dehors du composant
function Section({ title, icon: Icon, color, items, type }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className={color} />
        <h2 className="font-bold text-gray-800 dark:text-white">
          {title} <span className="text-gray-400 font-normal">({items.length})</span>
        </h2>
      </div>
      {items.map(t => <NotifCard key={t.id} tenant={t} type={type} />)}
    </div>
  );
}

export default function Notifications({ onBack, user }) {
  const [tenants, setTenants] = useState([]);

  // Charge les locataires au montage
  useEffect(() => {
    const load = async () => {
      if (!user) return;

      try {
        const data = await fetchTenants(user.uid);
        setTenants(data);
      } catch (err) {
        console.error('Erreur chargement notifications:', err);
      }
    };
    load();
  }, [user]);

  const expired = tenants.filter(t => getDaysUntilExpiry(t.endDate) < 0);
  const expiringSoon = tenants.filter(t => {
    const d = getDaysUntilExpiry(t.endDate);
    return d >= 0 && d <= 7;
  });
  const upcoming = tenants.filter(t => {
    const d = getDaysUntilExpiry(t.endDate);
    return d > 7 && d <= 30;
  });

  const totalAlerts = expired.length + expiringSoon.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Header avec bouton retour — mobile uniquement */}
      <div className="md:hidden bg-gradient-to-br from-accent to-accent-dark px-6 pt-12 pb-6 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>

          <h1 className="text-white text-2xl font-bold">Notifications</h1>
        </div>
        
        {totalAlerts > 0 && (
          <p className="text-white/70 text-sm font-semibold">
            {totalAlerts} alerte{totalAlerts > 1 ? 's' : ''} en attente
          </p>
        )}
      </div>

      {/* Titre PC uniquement */}
      <div className="hidden md:block px-8 pt-8 pb-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Alertes</h1>
      {totalAlerts > 0 && (
        <p className="text-gray-400 text-sm mt-1">
          {totalAlerts} alerte{totalAlerts > 1 ? 's' : ''} en attente
        </p>
      )}
    </div>

      {/* Contenu principal avec chevauchement */}
      <div className="px-5 pt-5">
        {expired.length === 0 && expiringSoon.length === 0 && upcoming.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} className="text-green-500" />
            </div>
            <p className="font-bold text-gray-700 dark:text-white text-lg mb-2">Tout est à jour !</p>
            <p className="text-gray-400 text-sm">Aucune alerte pour le moment.</p>
          </div>
        ) : (
          <>
            <Section title="Expirés" icon={AlertCircle} color="text-red-500" items={expired} type="expired" />
            <Section title="Expirent bientôt" icon={Clock} color="text-orange-500" items={expiringSoon} type="soon" />
            <Section title="À venir ce mois" icon={Calendar} color="text-green-500" items={upcoming} type="upcoming" />
          </>
        )}
      </div>
    </div>
  );
}