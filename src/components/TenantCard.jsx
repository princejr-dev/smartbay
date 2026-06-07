import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Pencil,
  Phone,
  Trash2,
  User,
} from 'lucide-react';
import { formatDate, formatNumber, getDaysUntilExpiry } from '../utils/helpers';

const pluralizeDay = (days) => (Math.abs(days) <= 1 ? 'jour' : 'jours');

const getStatusConfig = (days) => {
  if (days < 0) {
    return {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-l-red-500',
      color: 'text-red-500',
      icon: AlertCircle,
      label: `Expiré depuis ${Math.abs(days)} ${pluralizeDay(days)}`,
    };
  }

  if (days <= 7) {
    return {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-l-orange-500',
      color: 'text-orange-500',
      icon: Clock,
      label: `Expire dans ${days} ${pluralizeDay(days)}`,
    };
  }

  return {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-l-green-500',
    color: 'text-green-500',
    icon: CheckCircle,
    label: `Actif - ${days} ${pluralizeDay(days)} restants`,
  };
};

export default function TenantCard({ tenant, onEdit, onDelete, onReceipt }) {
  const days = getDaysUntilExpiry(tenant.endDate);
  const isExpired = days < 0;

  // La couleur de la carte dépend de la date d'expiration du bail.
  const statusConfig = getStatusConfig(days);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`mb-4 rounded-2xl border-l-4 bg-white p-5 shadow-md transition-transform duration-200 hover:-translate-y-1 dark:bg-gray-800 ${statusConfig.border}`}
    >
      <div
        className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${statusConfig.bg} ${statusConfig.color}`}
      >
        <StatusIcon size={12} />
        {statusConfig.label}
      </div>

      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <User size={22} className="text-accent" />
          </div>

          <div>
            <p className="text-base font-bold text-gray-800 dark:text-white">
              {tenant.civility} {tenant.name}
            </p>
            {tenant.phone && (
              <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-400">
                <Phone size={12} />
                {tenant.phone}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-accent">{formatNumber(tenant.rent)}</p>
          <p className="text-xs text-gray-400">FCFA/mois</p>
        </div>
      </div>

      <div className="mb-4 h-px bg-gray-100 dark:bg-gray-700" />

      <div className="mb-3 flex justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar size={14} className="text-accent" />
          <span>
            Entrée :{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {formatDate(tenant.startDate)}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar size={14} className={isExpired ? 'text-red-500' : 'text-accent'} />
          <span>
            Exp. :{' '}
            <span
              className={`font-medium ${
                isExpired ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {formatDate(tenant.endDate)}
            </span>
          </span>
        </div>
      </div>

      {tenant.advance > 0 && (
        <div className="mb-3 flex justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Avance : <span className="font-bold text-accent">{formatNumber(tenant.advance)} FCFA</span>
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Reste : <span className="font-bold text-red-500">{formatNumber(tenant.reste)} FCFA</span>
          </span>
        </div>
      )}

      <div className="mb-3 h-px bg-gray-100 dark:bg-gray-700" />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onReceipt(tenant)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 py-2 text-sm font-semibold text-blue-500 transition-colors hover:bg-blue-100 dark:bg-blue-900/20"
        >
          <FileText size={15} />
          Reçu
        </button>

        <button
          type="button"
          onClick={() => onEdit(tenant)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent/10 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
        >
          <Pencil size={15} />
          Modifier
        </button>

        <button
          type="button"
          onClick={() => onDelete(tenant.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-100 dark:bg-red-900/20"
        >
          <Trash2 size={15} />
          Supprimer
        </button>
      </div>
    </div>
  );
}
