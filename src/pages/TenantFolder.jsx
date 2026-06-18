import { useState, useEffect } from 'react';
import { Search, X, FolderOpen, Archive, CheckCircle, AlertCircle, Trash2, ArrowLeft } from 'lucide-react';
import FolderCard from '../components/FolderCard';
import { fetchTenants, archiveTenant, deleteTenant } from '../utils/firestore';
import { getDaysUntilExpiry } from '../utils/helpers';

export default function TenantFolder({ user, onOpenDetail, onBack }) {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState('');

  // Charge les locataires depuis Firestore
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const data = await fetchTenants(user.uid);
        setTenants(data);
      } catch (err) {
        console.error('Erreur chargement dossiers:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Archive un locataire
  const handleArchive = async (tenantId) => {
    if (!window.confirm('Archiver ce locataire ?')) return;
    try {
      await archiveTenant(tenantId);
      setTenants(prev => prev.map(t =>
        t.id === tenantId ? { ...t, status: 'archived' } : t
      ));
      showToast(
        <span className="flex items-center justify-center gap-1">
          <FolderOpen size={20} />
          Locataire archivé !
        </span>
      );
    } catch (err) {
      console.error('Erreur archivage:', err);
    }
  };

  // Supprime définitivement un locataire
  const handleDelete = async (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!window.confirm(`Supprimer définitivement ${tenant?.civility} ${tenant?.name} ? Cette action est irréversible.`)) return;
    try {
      await deleteTenant(tenantId);
      setTenants(prev => prev.filter(t => t.id !== tenantId));
      showToast(
        <span className="flex items-center justify-center gap-1">
            <Trash2 size={20} />
              Locataire supprimé définitivement !
        </span>
        );
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  // Filtrage selon recherche et filtre actif
  const filtered = tenants
    .filter(t =>
      `${t.civility} ${t.name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(t => {
      if (filter === 'all') return t.status !== 'archived';
      if (filter === 'active') {
        const days = getDaysUntilExpiry(t.endDate);
        return days > 7 && t.status !== 'archived';
      }
      if (filter === 'late') {
        const days = getDaysUntilExpiry(t.endDate);
        return days < 0 && t.status !== 'archived';
      }
      if (filter === 'archived') return t.status === 'archived';
      return true;
    });

  // Statistiques rapides
  const activeCount = tenants.filter(t => getDaysUntilExpiry(t.endDate) > 7 && t.status !== 'archived').length;
  const lateCount = tenants.filter(t => getDaysUntilExpiry(t.endDate) < 0 && t.status !== 'archived').length;
  const archivedCount = tenants.filter(t => t.status === 'archived').length;

  const filters = [
    { key: 'all', label: 'Tous', count: tenants.filter(t => t.status !== 'archived').length },
    { key: 'active', label: 'Actifs', count: activeCount },
    { key: 'late', label: 'En retard', count: lateCount },
    { key: 'archived', label: 'Archivés', count: archivedCount },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header mobile */}
    <div className="md:hidden bg-gradient-to-br from-accent to-accent-dark px-6 pt-12 pb-6 sticky top-0 z-20">
      <div className="flex items-center gap-4 mb-1">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Dossiers</h1>
      </div>
      <p className="text-white/70 text-sm font-semibold ml-13">
        {tenants.filter(t => t.status !== 'archived').length} dossier{tenants.length > 1 ? 's' : ''} actif{tenants.length > 1 ? 's' : ''}
      </p>
    </div>

    {/* Contenu avec padding — PC uniquement pour le titre */}
    <div className="p-8">

      {/* Titre */}
      <div className="hidden md:block mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dossiers locataires</h1>
        <p className="text-gray-400 text-sm mt-1">
          {tenants.filter(t => t.status !== 'archived').length} dossier{tenants.length > 1 ? 's' : ''} actif{tenants.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle size={18} className="text-green-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{activeCount}</p>
            <p className="text-xs text-gray-400">Actifs</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{lateCount}</p>
            <p className="text-xs text-gray-400">En retard</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center">
            <Archive size={18} className="text-gray-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{archivedCount}</p>
            <p className="text-xs text-gray-400">Archivés</p>
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-4 focus-within:border-accent dark:focus-within:border-accent transition-colors">
        <Search size={18} className="text-accent flex-shrink-0" />
        <input
          type="text"
          placeholder="Rechercher un dossier..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')}>
            <X size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all
              ${filter === f.key
                ? 'bg-accent text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            {f.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f.key ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        /* Aucun dossier */
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
            <FolderOpen size={32} className="text-accent" />
          </div>
          <p className="font-semibold text-gray-700 dark:text-white text-lg">Aucun dossier trouvé</p>
          <p className="text-gray-400 text-sm text-center max-w-sm">
            {filter === 'archived'
              ? 'Aucun locataire archivé pour le moment.'
              : 'Ajoutez un locataire via le bouton + pour créer un dossier.'
            }
          </p>
        </div>
      ) : (
        /* Grille de dossiers */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(tenant => (
            <FolderCard
              key={tenant.id}
              tenant={tenant}
              onOpenFolder={onOpenDetail}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 dark:bg-gray-700 text-white py-3 px-5 rounded-xl shadow-xl z-50">
          {toast}
        </div>
      )}
    </div>
  </div>
  );
}