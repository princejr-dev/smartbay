import { useState } from 'react';
import {
  Users, TrendingUp, AlertCircle, CheckCircle,
  Plus, FileText, Pencil, Trash2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { loadTenants, saveTenants } from '../utils/storage';
import { formatNumber, formatDate, getDaysUntilExpiry } from '../utils/helpers';
import { generateReceipt } from '../utils/receipt';
import TenantModal from '../components/TenantModal';

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
          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Loyer</th>
          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Durée</th>
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
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">{tenant.duration} mois</p>
                <p className="text-xs text-gray-400">{formatDate(tenant.startDate)}</p>
              </td>
              <td className="px-6 py-4">
                <p className={`text-sm font-medium ${isExpired ? 'text-red-500' : isSoon ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300'}`}>
                  {formatDate(tenant.endDate)}
                </p>
                <p className={`text-xs ${isExpired ? 'text-red-400' : isSoon ? 'text-orange-400' : 'text-gray-400'}`}>
                  {isExpired ? `${Math.abs(days)} jours de retard` : `${days} jours restants`}
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

export default function PCDashboard({ searchTerm, activePage }) {
  const [tenants, setTenants] = useState(() => loadTenants());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Sauvegarde ou modification d'un locataire
  const handleSave = (tenantData) => {
    let updated;
    const exists = tenants.find(t => t.id === tenantData.id);
    if (exists) {
      updated = tenants.map(t => t.id === tenantData.id ? tenantData : t);
      showToast(`✅ Modifié avec succès !`);
    } else {
      updated = [...tenants, tenantData];
      showToast(`✅ Ajouté avec succès !`);
    }
    setTenants(updated);
    saveTenants(updated);
    setModalVisible(false);
    setEditingTenant(null);
  };

  // Supprime toutes les données avec confirmation
  const handleDelete = (id) => {
    const tenant = tenants.find(t => t.id === id);
    const article = tenant.civility === 'Mme' ? 'la' : 'le';
    
    if (window.confirm(`Voulez-vous supprimer ${article} locataire ${tenant.civility} ${tenant.name} ?`)) {
      const updated = tenants.filter(t => t.id !== id);
      setTenants(updated);
      saveTenants(updated);
      
      showToast(
        <span className="flex items-center justify-center gap-2">
          <Trash2 className="text-red-600 dark:bg-red-900/20" size={16} /> Suppression réussie !
        </span>
      );
    }
  };

  const handleReceipt = (tenant) => {
    generateReceipt(tenant);
    const updated = tenants.map(t =>
      t.id === tenant.id ? { ...t, receiptCount: (t.receiptCount || 1) + 1 } : t
    );
    setTenants(updated);
    saveTenants(updated);
  };

  const filtered = tenants.filter(t =>
    `${t.civility} ${t.name}`.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const expired = tenants.filter(t => getDaysUntilExpiry(t.endDate) < 0);
  const expiringSoon = tenants.filter(t => {
    const d = getDaysUntilExpiry(t.endDate);
    return d >= 0 && d <= 7;
  });
  const active = tenants.filter(t => getDaysUntilExpiry(t.endDate) > 7);
  const totalRevenue = tenants.reduce((sum, t) => sum + (t.rent || 0), 0);
  const revenueData = buildRevenueData(tenants);

  // ===== PAGE LOCATAIRES =====
  if (activePage === 'tenants') {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Locataires</h1>
            <p className="text-gray-400 text-sm mt-1">Vue d&#39;ensemble de vos locataires</p>
          </div>
          <button
            onClick={() => { setEditingTenant(null); setModalVisible(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-accent to-accent-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-accent/30"
          >
            <Plus size={18} />
            Nouveau locataire
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <TenantsTable
            tenants={filtered}
            onEdit={(t) => { setEditingTenant(t); setModalVisible(true); }}
            onDelete={handleDelete}
            onReceipt={handleReceipt}
          />
        </div>

        {toast && (
          <div className="fixed bottom-8 right-8 bg-gray-900 dark:bg-gray-700 text-white py-3 px-5 rounded-xl shadow-xl z-50">
            {toast}
          </div>
        )}

        <TenantModal
          key={editingTenant?.id || 'new-' + modalVisible}
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

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total locataires', value: tenants.length, icon: Users, color: 'bg-accent/10 text-accent', trend: null },
          { label: 'Locataires actifs', value: active.length, icon: CheckCircle, color: 'bg-green-50 dark:bg-green-900/20 text-green-500', trend: null },
          { label: 'Revenus ce mois', value: `${formatNumber(totalRevenue)} FCFA`, icon: TrendingUp, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500', trend: '+12%' },
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
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => [`${formatNumber(value)} FCFA`, 'Revenus']}
              />
              <Area type="monotone" dataKey="revenus" stroke="#667eea" strokeWidth={2.5} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alertes urgentes */}
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
                      {type === 'expired' ? `Expiré depuis ${Math.abs(getDaysUntilExpiry(t.endDate))} jours` : `Expire dans ${getDaysUntilExpiry(t.endDate)} jours`}
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
          <h2 className="font-bold text-gray-800 dark:text-white">
            Locataires récents
          </h2>
        </div>
        <TenantsTable
          tenants={filtered.slice(0, 5)}
          onEdit={(t) => { setEditingTenant(t); setModalVisible(true); }}
          onDelete={handleDelete}
          onReceipt={handleReceipt}
        />
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 dark:bg-gray-700 text-white py-3 px-5 rounded-xl shadow-xl z-50">
          {toast}
        </div>
      )}

      <TenantModal
        key={editingTenant?.id || 'new-' + modalVisible}
        visible={modalVisible}
        tenant={editingTenant}
        onSave={handleSave}
        onClose={() => { setModalVisible(false); setEditingTenant(null); }}
      />
    </div>
  );
}