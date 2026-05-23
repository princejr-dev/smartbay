import { User, Phone, Calendar, FileText, Pencil, Trash2, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { formatDate, formatNumber, getDaysUntilExpiry } from '../utils/helpers';

export default function TenantCard({ tenant, onEdit, onDelete, onReceipt }) {
  const days = getDaysUntilExpiry(tenant.endDate);
  const isExpired = days < 0;
  const isExpiringSoon = days >= 0 && days <= 7;

  // Couleur et icône selon le statut
  const statusConfig = isExpired
    ? { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-l-red-500', icon: AlertCircle, label: `Expiré depuis ${Math.abs(days)} ${Math.abs(days) <= 1 ? 'jour' : 'jours'}` }
    : isExpiringSoon
    ? { color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-l-orange-500', icon: Clock, label: `Expire dans ${days} ${days <= 1 ? 'jour' : 'jours'}` }
    : { color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-l-green-500', icon: CheckCircle, label: `Actif — ${days} ${days <= 1 ? 'jour' : 'jours'} restants` };

  const StatusIcon = statusConfig.icon;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md border-l-4 ${statusConfig.border} p-5 mb-4 hover:-translate-y-1 transition-transform duration-200`}>

      {/* Badge statut */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 ${statusConfig.bg} ${statusConfig.color}`}>
        <StatusIcon size={12} />
        {statusConfig.label}
      </div>

      {/* Infos principales */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <User size={22} className="text-accent" />
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-white text-base">
              {tenant.civility} {tenant.name}
            </p>
            {tenant.phone && (
              <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                <Phone size={12} />
                {tenant.phone}
              </p>
            )}
          </div>
        </div>

        {/* Loyer */}
        <div className="text-right">
          <p className="font-bold text-accent text-lg">{formatNumber(tenant.rent)}</p>
          <p className="text-xs text-gray-400">FCFA/mois</p>
        </div>
      </div>

      {/* Séparateur */}
      <div className="h-px bg-gray-100 dark:bg-gray-700 mb-4" />

      {/* Période */}
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar size={14} className="text-accent" />
          <span>Entrée : <span className="font-medium text-gray-700 dark:text-gray-300">{formatDate(tenant.startDate)}</span></span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar size={14} className={isExpired ? 'text-red-500' : 'text-accent'} />
          <span>Exp. : <span className={`font-medium ${isExpired ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>{formatDate(tenant.endDate)}</span></span>
        </div>
      </div>

      {/* Avance / Reste */}
      {tenant.advance > 0 && (
        <div className="flex justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Avance : <span className="font-bold text-accent">{formatNumber(tenant.advance)} FCFA</span>
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Reste : <span className="font-bold text-red-500">{formatNumber(tenant.reste)} FCFA</span>
          </span>
        </div>
      )}

      {/* Séparateur */}
      <div className="h-px bg-gray-100 dark:bg-gray-700 mb-3" />

      {/* Boutons d'action */}
      <div className="flex gap-2">
        {/* Reçu PDF */}
        <button
          onClick={() => onReceipt(tenant)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 text-sm font-semibold hover:bg-blue-100 transition-colors"
        >
          <FileText size={15} />
          Reçu
        </button>

        {/* Modifier */}
        <button
          onClick={() => onEdit(tenant)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-accent/10 text-accent text-sm font-semibold hover:bg-accent/20 transition-colors"
        >
          <Pencil size={15} />
          Modifier
        </button>

        {/* Supprimer */}
        <button
          onClick={() => onDelete(tenant.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-semibold hover:bg-red-100 transition-colors"
        >
          <Trash2 size={15} />
          Supprimer
        </button>
      </div>
    </div>
  );
}