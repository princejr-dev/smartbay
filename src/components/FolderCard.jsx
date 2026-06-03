import { useState, useRef, useEffect } from 'react';
import {
  Phone, Calendar, DollarSign,
  FolderOpen, MoreVertical, Archive, Trash2,
  AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import { formatDate, formatNumber, getDaysUntilExpiry } from '../utils/helpers';

export default function FolderCard({ tenant, onOpenFolder, onArchive, onDelete }) {
  // État du menu 3 points
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  // Calcul du statut selon la date d'expiration
  const days = getDaysUntilExpiry(tenant.endDate);
  const isExpired = days < 0;
  const isExpiringSoon = days >= 0 && days <= 7;
  const isArchived = tenant.status === 'archived';

  // Config visuelle selon statut
  const statusConfig = isArchived
    ? { color: 'text-gray-400', bg: 'bg-gray-50 dark:bg-gray-700/50', border: 'border-l-gray-400', icon: Archive, label: 'Archivé' }
    : isExpired
    ? { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-l-red-500', icon: AlertCircle, label: `En retard — ${Math.abs(days)}j` }
    : isExpiringSoon
    ? { color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-l-orange-500', icon: Clock, label: `Expire dans ${days}j` }
    : { color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-l-green-500', icon: CheckCircle, label: 'Actif' };

  const StatusIcon = statusConfig.icon;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-l-4 ${statusConfig.border} p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>

      {/* En-tête carte */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-base">
              {tenant.name ? tenant.name[0].toUpperCase() : 'L'}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-white text-base">
              {tenant.civility} {tenant.name}
            </p>
            {/* Badge statut */}
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${statusConfig.bg} ${statusConfig.color}`}>
              <StatusIcon size={11} />
              {statusConfig.label}
            </div>
          </div>
        </div>

        {/* Menu 3 points */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
              {/* Archiver */}
              {!isArchived && (
                <button
                  onClick={() => { setMenuOpen(false); onArchive(tenant.id); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Archive size={15} className="text-gray-400" />
                  Archiver le locataire
                </button>
              )}
              {/* Supprimer */}
              <button
                onClick={() => { setMenuOpen(false); onDelete(tenant.id); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={15} />
                Supprimer définitivement
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Infos principales */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Loyer */}
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-accent flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Loyer</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {formatNumber(tenant.rent)} FCFA
            </p>
          </div>
        </div>

        {/* Téléphone */}
        {tenant.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Téléphone</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{tenant.phone}</p>
            </div>
          </div>
        )}

        {/* Date entrée */}
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-accent flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Entrée</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {formatDate(tenant.startDate)}
            </p>
          </div>
        </div>

        {/* Date expiration */}
        <div className="flex items-center gap-2">
          <Calendar size={14} className={isExpired ? 'text-red-500 flex-shrink-0' : 'text-accent flex-shrink-0'} />
          <div>
            <p className="text-xs text-gray-400">Expiration</p>
            <p className={`text-sm font-semibold ${isExpired ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
              {formatDate(tenant.endDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Bouton ouvrir dossier */}
      <button
        onClick={() => onOpenFolder(tenant)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-dark text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
      >
        <FolderOpen size={16} />
        Ouvrir le dossier
      </button>
    </div>
  );
}