import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Archive,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FolderOpen,
  MoreVertical,
  Phone,
  Trash2,
} from 'lucide-react';
import { formatDate, formatNumber, getDaysUntilExpiry } from '../utils/helpers';

const getStatusConfig = ({ days, isArchived }) => {
  if (isArchived) {
    return {
      bg: 'bg-gray-50 dark:bg-gray-700/50',
      border: 'border-l-gray-400',
      color: 'text-gray-400',
      icon: Archive,
      label: 'Archivé',
    };
  }

  if (days < 0) {
    return {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-l-red-500',
      color: 'text-red-500',
      icon: AlertCircle,
      label: `En retard - ${Math.abs(days)}j`,
    };
  }

  if (days <= 7) {
    return {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-l-orange-500',
      color: 'text-orange-500',
      icon: Clock,
      label: `Expire dans ${days}j`,
    };
  }

  return {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-l-green-500',
    color: 'text-green-500',
    icon: CheckCircle,
    label: 'Actif',
  };
};

export default function FolderCard({ tenant, onOpenFolder, onArchive, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Ferme le menu contextuel quand l'utilisateur clique ailleurs dans la page.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const days = getDaysUntilExpiry(tenant.endDate);
  const isArchived = tenant.status === 'archived';
  const isExpired = days < 0;

  // Le statut visuel dépend de l'archivage et de la date d'expiration du bail.
  const statusConfig = getStatusConfig({ days, isArchived });
  const StatusIcon = statusConfig.icon;

  const handleArchive = () => {
    setMenuOpen(false);
    onArchive(tenant.id);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete(tenant.id);
  };

  return (
    <div
      className={`rounded-2xl border-l-4 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-800 ${statusConfig.border}`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-dark">
            <span className="text-base font-bold text-white">
              {tenant.name ? tenant.name[0].toUpperCase() : 'L'}
            </span>
          </div>

          <div>
            <p className="text-base font-bold text-gray-800 dark:text-white">
              {tenant.civility} {tenant.name}
            </p>
            <div
              className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}
            >
              <StatusIcon size={11} />
              {statusConfig.label}
            </div>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Ouvrir les actions du dossier"
            aria-expanded={menuOpen}
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              {!isArchived && (
                <button
                  type="button"
                  onClick={handleArchive}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Archive size={15} className="text-gray-400" />
                  Archiver le locataire
                </button>
              )}

              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={15} />
                Supprimer définitivement
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="flex-shrink-0 text-accent" />
          <div>
            <p className="text-xs text-gray-400">Loyer</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {formatNumber(tenant.rent)} FCFA
            </p>
          </div>
        </div>

        {tenant.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} className="flex-shrink-0 text-accent" />
            <div>
              <p className="text-xs text-gray-400">Téléphone</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {tenant.phone}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Calendar size={14} className="flex-shrink-0 text-accent" />
          <div>
            <p className="text-xs text-gray-400">Entrée</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {formatDate(tenant.startDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar
            size={14}
            className={isExpired ? 'flex-shrink-0 text-red-500' : 'flex-shrink-0 text-accent'}
          />
          <div>
            <p className="text-xs text-gray-400">Expiration</p>
            <p
              className={`text-sm font-semibold ${
                isExpired ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {formatDate(tenant.endDate)}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpenFolder(tenant)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-dark py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
      >
        <FolderOpen size={16} />
        Ouvrir le dossier
      </button>
    </div>
  );
}
