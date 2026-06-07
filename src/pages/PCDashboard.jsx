import { useState, useEffect, useMemo } from 'react';

import {
  Users, TrendingUp, AlertCircle, CheckCircle,
  Plus, FileText, Pencil, Trash2, XCircle,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { formatNumber, formatDate, getDaysUntilExpiry } from '../utils/helpers';
import { generateReceipt } from '../utils/receipt';
import TenantModal from '../components/TenantModal';
import { fetchTenants, addTenant, updateTenant, deleteTenant } from '../utils/firestore';

function buildRevenueData(tenants) {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (now.getMonth() - 5 + i + 12) % 12;
    const total = tenants.reduce((sum, t) => sum + (t.rent || 0), 0);
    const variation = 0.85 + (i * 0.03);
    return {
      month: months[monthIndex],
      revenus: Math.round(total * variation),
    };
  });
}

// Tableau locataires réutilisable
function TenantsTable({ tenants, onEdit, onDelete, onReceipt }) {
  if (tenants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Users size={40} className="text-gray-300" />
        <p className="text-gray-400">Aucun locataire trouvé</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Locataire</th>
          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Loyer mensuel</th>
          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Durée</th>
          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Expiration</th>
          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
        {tenants.map(tenant => {
          const days = getDaysUntilExpiry(tenant.endDate);
          const isExpired = days < 0;
          const isSoon = days >= 0 && days <= 7;

          return (
            <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-accent" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">
                      {tenant.civility} {tenant.name}
                    </p>
                    {tenant.phone && <p className="text-xs text-gray-400">{tenant.phone}</p>}
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <p className="font-semibold text-accent text-sm">{formatNumber(tenant.rent)} FCFA</p>
                {tenant.advance > 0 && (
                  <p className="text-xs text-gray-400">Avance: {formatNumber(tenant.advance)}</p>
                )}
                {tenant.advance > 0 && tenant.reste > 0 && (
                  <p className="text-xs text-gray-400">Reste: {formatNumber(tenant.reste)}</p>
                )}
              </td>

              <td className="px-6 py-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">{tenant.duration} mois</p>
                <p className="text-xs text-gray-400">{formatDate(tenant.startDate)}</p>
              </td>

              <td className="px-6 py-4">
                <p className="font-semibold text-accent text-sm">{formatNumber(tenant.rent * tenant.duration)} FCFA</p>
              </td>

              <td className="px-6 py-4">
                <p className={`text-sm font-medium ${isExpired ? 'text-red-500' : isSoon ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300'}`}>
                  {formatDate(tenant.endDate)}
                </p>
                <p className={`text-xs ${isExpired ? 'text-red-400' : isSoon ? 'text-orange-400' : 'text-gray-400'}`}>
                  {isExpired ? `${Math.abs(days)} ${Math.abs(days) <= 1 ? 'jour de retard' : 'jours de retard'}` : `${Math.abs(days)} ${Math.abs(days) <= 1 ? 'jour restant' : 'jours restants'}`}
                </p>
              </td>

              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold
                  ${isExpired ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                    : isSoon ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-500'}`}>
                  {isExpired ? 'Expiré' : isSoon ? 'Bientôt' : 'Actif'}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => onReceipt(tenant)} className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center hover:bg-blue-100 transition-colors" title="Reçu">
                    <FileText size={14} className="text-blue-500" />
                  </button>
                  <button onClick={() => onEdit(tenant)} className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors" title="Modifier">
                    <Pencil size={14} className="text-accent" />
                  </button>
                  <button onClick={() => onDelete(tenant.id)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center hover:bg-red-100 transition-colors" title="Supprimer">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function PCDashboard({ searchTerm, activePage, user }) {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [toast, setToast] = useState('');

  // Charge les locataires depuis Firestore à chaque changement de page
useEffect(() => {
  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchTenants(user.uid);
      setTenants(data);
    } catch (err) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };
  load();
}, [user, activePage]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Sauvegarde via Firestore
const handleSave = async (tenantData) => {
  try {
    if (tenantData.id && typeof tenantData.id === 'string') {
      // Modification — id Firestore existant (string)
      await updateTenant(tenantData.id, tenantData);
      setTenants(prev => prev.map(t => t.id === tenantData.id ? { ...t, ...tenantData } : t));
      showToast(
        <span className="flex items-center justify-center gap-1">
            <Pencil size={20} className="text-green-500 font-bold" />
            Modifié avec succès !
        </span>
          );
    } else {
      // Ajout — pas d'id ou id numérique → Firestore génère un id string
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
  setModalVisible(false);
  setEditingTenant(null);
};

// Suppression via Firestore
const handleDelete = async (id) => {
  const tenant = tenants.find(t => t.id === id);
  if (!tenant) return;
  const article = tenant.civility === 'Mme' ? 'la' : 'le';
  if (!window.confirm(`Voulez-vous supprimer ${article} locataire ${tenant.civility} ${tenant.name} ?`)) return;
  try {
    await deleteTenant(id);
    setTenants(prev => prev.filter(t => t.id !== id));
    showToast('🗑 Suppression réussie !');
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
  const newCount = (tenant.receiptCount || 1) + 1;
  try {
    await updateTenant(tenant.id, { receiptCount: newCount });
    setTenants(prev => prev.map(t =>
      t.id === tenant.id ? { ...t, receiptCount: newCount } : t
    ));
  } catch (err) {
    console.error('Erreur update receipt:', err);
  }
  showToast(
    <span className="flex items-center justify-center gap-1">
      <FileText size={20} />
      Reçu généré !
    </span>
  );
};

  const filtered = useMemo(() =>
  tenants.filter(t =>
    `${t.civility} ${t.name}`.toLowerCase().includes((searchTerm || '').toLowerCase())
  ), [tenants, searchTerm]);

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

const revenueData = useMemo(() =>
  buildRevenueData(tenants),
  [tenants]);

  // ===== PAGE LOCATAIRES =====
  if (activePage === 'tenants') {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Locataires</h1>
            <p className="text-gray-400 text-sm mt-1">
              {tenants.length} locataire{tenants.length > 1 ? 's' : ''} enregistré{tenants.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => { setEditingTenant(null); setModalVisible(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-accent to-accent-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-accent/30"
          >
            <Plus size={18} />
            Nouveau locataire
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <TenantsTable
              tenants={filtered}
              onEdit={(t) => { setEditingTenant(t); setModalVisible(true); }}
              onDelete={handleDelete}
              onReceipt={handleReceipt}
            />
          </div>
        )}

        {toast && (
          <div className="fixed bottom-8 right-8 bg-gray-900 dark:bg-gray-700 text-white py-3 px-5 rounded-xl shadow-xl z-50">
            {toast}
          </div>
        )}

        <TenantModal
  key={editingTenant ? `edit-${editingTenant.id}` : `new-${modalVisible}`}
  visible={modalVisible}
  tenant={editingTenant}
  onSave={handleSave}
  onClose={() => { setModalVisible(false); setEditingTenant(null); }}
/>
      </div>
    );
  }

  // ===== PAGE DASHBOARD =====
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Total locataires', value: tenants.length, icon: Users, color: 'bg-accent/10 text-accent', trend: null },
              { label: 'Locataires actifs', value: active.length, icon: CheckCircle, color: 'bg-green-50 dark:bg-green-900/20 text-green-500', trend: null },
              { label: 'Revenus ce mois', value: `${formatNumber(totalRevenue)} FCFA`, icon: TrendingUp, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500', trend: null },
              { label: 'Alertes', value: expired.length + expiringSoon.length, icon: AlertCircle, color: 'bg-red-50 dark:bg-red-900/20 text-red-500', trend: null },
            ].map(({ label, value, icon: Icon, color, trend }) => (
              <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={18} />
                  </div>
                  {trend && (
                    <span className="text-xs font-semibold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                      {trend}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Graphique + Alertes */}
          <div className="grid grid-cols-3 gap-5 mb-8">
            <div className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-800 dark:text-white">Revenus</h2>
                <span className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg">6 derniers mois</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(value) => [`${formatNumber(value)} FCFA`, 'Revenus']}
                  />
                  <Area type="monotone" dataKey="revenus" stroke="#667eea" strokeWidth={2.5} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-800 dark:text-white mb-4">Alertes</h2>
              {expired.length === 0 && expiringSoon.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <CheckCircle size={36} className="text-green-400" />
                  <p className="text-sm text-gray-400 text-center">Aucune alerte</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 overflow-y-auto max-h-52">
                  {[...expired.map(t => ({ t, type: 'expired' })), ...expiringSoon.map(t => ({ t, type: 'soon' }))].map(({ t, type }) => (
                    <div key={t.id} className={`flex items-start gap-3 p-3 rounded-xl ${type === 'expired' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                      <AlertCircle size={16} className={`flex-shrink-0 mt-0.5 ${type === 'expired' ? 'text-red-500' : 'text-orange-500'}`} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{t.civility} {t.name}</p>
                        <p className={`text-xs ${type === 'expired' ? 'text-red-500' : 'text-orange-500'}`}>
                          {type === 'expired' ? `Expiré depuis ${Math.abs(getDaysUntilExpiry(t.endDate))}j` : `Expire dans ${getDaysUntilExpiry(t.endDate)}j`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tableau locataires récents */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-800 dark:text-white">Locataires récents</h2>
            </div>
            <TenantsTable
              tenants={filtered.slice(0, 5)}
              onEdit={(t) => { setEditingTenant(t); setModalVisible(true); }}
              onDelete={handleDelete}
              onReceipt={handleReceipt}
            />
          </div>
        </>
      )}

      {toast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 dark:bg-gray-700 text-white py-3 px-5 rounded-xl shadow-xl z-50">
          {toast}
        </div>
      )}

      <TenantModal
  key={editingTenant ? `edit-${editingTenant.id}` : `new-${modalVisible}`}
  visible={modalVisible}
  tenant={editingTenant}
  onSave={handleSave}
  onClose={() => { setModalVisible(false); setEditingTenant(null); }}
/>
    </div>
  );
}