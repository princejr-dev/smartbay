import { useState } from 'react';
import { Search, X, Trash2 } from 'lucide-react';
import TenantCard from '../components/TenantCard';
import TenantModal from '../components/TenantModal';
import { loadTenants, saveTenants } from '../utils/storage';
import { getDaysUntilExpiry } from '../utils/helpers';
import { generateReceipt } from '../utils/receipt';

export default function Tenants({ modalOpen, onModalClose }) {
  const [tenants, setTenants] = useState(() => loadTenants());
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(modalOpen || false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [toast, setToast] = useState('');

  // Ouvre le modal depuis le parent
  if (modalOpen && !modalVisible) {
    setModalVisible(true);
  }

  const handleModalClose = () => {
    setEditingTenant(null);
    setModalVisible(false);

    if (onModalClose) onModalClose();
  };

  // Affiche un toast temporaire
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Sauvegarde un locataire (ajout ou modification)
  const handleSave = (tenantData) => {
    let updated;
    const exists = tenants.find(t => t.id === tenantData.id);

    if (exists) {
      // Modification
      updated = tenants.map(t =>
        t.id === tenantData.id ? tenantData : t
      );

      showToast(`✅ ${tenantData.civility} ${tenantData.name} modifié !`);
    } else {
      // Ajout
      updated = [...tenants, tenantData];

      showToast(`✅ ${tenantData.civility} ${tenantData.name} ajouté !`);
    }

    setTenants(updated);
    saveTenants(updated);

    // Ferme le modal après sauvegarde
    setModalVisible(false);
    setEditingTenant(null);

    if (onModalClose) onModalClose();
  };

  // Supprime un locataire avec confirmation
  const handleDelete = (id) => {
    const tenant = tenants.find(t => t.id === id);

    if (window.confirm(`Supprimer ${tenant.civility} ${tenant.name} ?`)) {
      const updated = tenants.filter(t => t.id !== id);

      setTenants(updated);
      saveTenants(updated);

      showToast(
       <span className="flex items-center justify-center gap-2">
        <Trash2 size={16} />{tenant.name} supprimé !
       </span> );
    }
  };

  // Génère le reçu et incrémente le compteur
  const handleReceipt = (tenant) => {
    generateReceipt(tenant);

    const updated = tenants.map(t =>
      t.id === tenant.id
        ? { ...t, receiptCount: (t.receiptCount || 0) + 1 }
        : t
    );

    setTenants(updated);
    saveTenants(updated);
  };

  // Filtre les locataires selon la recherche et le filtre actif
  const filtered = tenants
    .filter(t =>
      `${t.civility} ${t.name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter(t => {
      if (filter === 'all') return true;

      const days = getDaysUntilExpiry(t.endDate);

      if (filter === 'expired') return days < 0;
      if (filter === 'soon') return days >= 0 && days <= 7;
      if (filter === 'active') return days > 7;

      return true;
    });

  const filters = [
    { key: 'all', label: 'Tous' },
    { key: 'active', label: 'Actifs' },
    { key: 'soon', label: 'Bientôt' },
    { key: 'expired', label: 'Expirés' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pt-12 pb-6">
        <h1 className="text-white text-2xl font-bold mb-1">
          Mes locataires
        </h1>

        <p className="text-white/70 text-sm">
          {tenants.length} locataire{tenants.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="px-5 pt-5">

        {/* Barre de recherche */}
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-4 focus-within:border-accent">

          <Search
            size={18}
            className="text-accent flex-shrink-0"
          />

          <input
            type="text"
            placeholder="Rechercher un locataire..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm"
          />

          {searchTerm && (
            <button onClick={() => setSearchTerm('')}>
              <X
                size={18}
                className="text-gray-400 hover:text-gray-600"
              />
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">

          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all
                ${filter === f.key
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Liste des locataires */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">

            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Search
                size={32}
                className="text-accent"
              />
            </div>

            <p className="text-gray-500 dark:text-gray-400">
              Aucun locataire trouvé
            </p>
          </div>
        ) : (
          filtered.map(tenant => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              onEdit={(t) => {
                setEditingTenant(t);
                setModalVisible(true);
              }}
              onDelete={handleDelete}
              onReceipt={handleReceipt}
            />
          ))
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-24 left-4 right-4 max-w-2xl mx-auto bg-gray-900 dark:bg-gray-700 text-white text-center py-3 px-5 rounded-xl shadow-xl z-50 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Modal ajout/modification */}
      <TenantModal
        key={editingTenant?.id || 'new'}
        visible={modalVisible}
        tenant={editingTenant}
        onSave={handleSave}
        onClose={handleModalClose}
      />
    </div>
  );
}