import { useState, useEffect, useRef } from 'react';
import { Search, XCircle, ArrowLeft, Plus, Trash2, CheckCircle2, Pencil } from 'lucide-react';
import TenantCard from '../components/TenantCard';
import TenantModal from '../components/TenantModal';
import { fetchTenants, addTenant, updateTenant, deleteTenant } from '../utils/firestore';
import { getDaysUntilExpiry } from '../utils/helpers';
import { generateReceipt } from '../utils/receipt';

export default function Tenants({ onBack, modalOpen, onModalClose, user }) {
  const [tenants, setTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(!!modalOpen);
  const [editingTenant, setEditingTenant] = useState(null);
  const [toast, setToast] = useState('');
  const [fabOpacity, setFabOpacity] = useState(1);
  const scrollTimer = useRef(null);

  // Charge les locataires depuis Firestore
  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return;
      try {
        const data = await fetchTenants(user.uid);
        setTenants(data);
      } catch (err) {
        console.error('Erreur chargement:', err);
      }
    };
    load();
  }, [user]);

  // Opacité du bouton + au scroll
  useEffect(() => {
    const handleScroll = () => {
      setFabOpacity(0.3);
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setFabOpacity(1), 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleModalClose = () => {
    setEditingTenant(null);
    setModalVisible(false);
    if (onModalClose) onModalClose();
  };

  // Ouvre le modal d'édition avec le bon locataire
  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setModalVisible(true);
  };

  // Ouvre le modal d'ajout vide
  const handleAdd = () => {
    setEditingTenant(null);
    setModalVisible(true);
  };

  // Sauvegarde ajout ou modification
  const handleSave = async (tenantData) => {
    try {
      if (tenantData.id) {
        // Modification — id Firestore existant
        await updateTenant(tenantData.id, tenantData);
        setTenants(prev => prev.map(t => t.id === tenantData.id ? { ...t, ...tenantData } : t));
        showToast(
          <span className="flex items-center justify-center gap-1">
            <Pencil size={20} className="text-green-500 font-bold" />
            Modifié avec succès !
          </span>
        );
      } else {
        // Ajout — pas d'id, Firestore en génère un
        const saved = await addTenant(user.uid, tenantData);
        setTenants(prev => [saved, ...prev]);
        showToast(
          <span className="flex items-center justify-center gap-1">
            <CheckCircle2 size={20} className="text-green-500 font-bold" />
            Ajouté avec succès !
          </span>
        );
      }
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      showToast(
        <span className="flex items-center justify-center gap-1">
          <XCircle size={20} className="text-red-500 font-bold" />
          Erreur lors de la sauvegarde.
        </span>
      );
    }
    handleModalClose();
  };

  // Supprime un locataire
  const handleDelete = async (id) => {
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) return;
    const article = tenant.civility === 'Mme' ? 'la' : 'le';
    if (!window.confirm(`Voulez-vous supprimer ${article} locataire ${tenant.civility} ${tenant.name} ?`)) return;
    try {
      await deleteTenant(id);
      setTenants(prev => prev.filter(t => t.id !== id));
      showToast(
        <span className="flex items-center justify-center gap-1">
          <Trash2 size={20} className="text-red-500 font-bold" />
          Suppression réussie !
        </span>
      );
    } catch (err) {
      console.error('Erreur suppression:', err);
      showToast(
        <span className="flex items-center justify-center gap-1">
          <XCircle size={20} className="text-red-500 font-bold" />
          Erreur lors de la suppression.
        </span>
      );
    }
  };

  // Génère le reçu et incrémente le compteur
  const handleReceipt = async (tenant) => {
    generateReceipt(tenant);
    const newCount = (tenant.receiptCount || 0) + 1;
    try {
      await updateTenant(tenant.id, { receiptCount: newCount });
      setTenants(prev => prev.map(t =>
        t.id === tenant.id ? { ...t, receiptCount: newCount } : t
      ));
    } catch (err) {
      console.error('Erreur update receipt:', err);
    }
  };

  const filtered = tenants
    .filter(t => `${t.civility} ${t.name}`.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pt-12 pb-6 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold">Mes locataires</h1>
        </div>
        <p className="text-white/70 text-sm font-semibold">
          {tenants.length} locataire{tenants.length > 1 ? 's' : ''} disponible{tenants.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="px-5 pt-5">

        {/* Recherche */}
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-4 focus-within:border-accent">
          <Search size={18} className="text-accent flex-shrink-0" />
          <input
            type="text"
            placeholder="Rechercher un locataire..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')}>
              <XCircle size={18} className="text-gray-400 hover:text-gray-600" />
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

        {/* Liste */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-accent" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Aucun locataire trouvé</p>
          </div>
        ) : (
          filtered.map(tenant => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReceipt={handleReceipt}
            />
          ))
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-4 right-4 max-w-2xl mx-auto bg-gray-900 dark:bg-gray-700 text-white text-center py-3 px-5 rounded-xl shadow-xl z-50">
          {toast}
        </div>
      )}

      {/* Bouton + flottant */}
      <button
        onClick={handleAdd}
        style={{ opacity: fabOpacity }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-accent to-accent-dark text-white rounded-full flex items-center justify-center shadow-xl transition-opacity duration-300 hover:scale-110"
      >
        <Plus size={26} />
      </button>

      {/* Modal — key change à chaque ouverture pour forcer reset */}
      <TenantModal
        key={editingTenant ? `edit-${editingTenant.id}` : `new-${modalVisible}`}
        visible={modalVisible}
        tenant={editingTenant}
        onSave={handleSave}
        onClose={handleModalClose}
      />
    </div>
  );
}