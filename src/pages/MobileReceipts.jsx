import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Calendar, DollarSign, Clock } from 'lucide-react';
import { fetchTenants, updateTenant } from '../utils/firestore';
import { formatDate, formatNumber } from '../utils/helpers';
import { generateReceipt } from '../utils/receipt';

export default function MobileReceipts({ user, onBack }) {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const data = await fetchTenants(user.uid);
        setTenants(data);
      } catch (err) {
        console.error('Erreur chargement reçus:', err);
      }
    };
    load();
  }, [user]);

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
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pt-12 pb-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold">Reçus</h1>
        </div>
        <p className="text-white/70 text-sm mt-1">
          {tenants.length} locataire{tenants.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="px-5 pt-5 pb-24">

        {tenants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
              <FileText size={32} className="text-accent" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-white">Aucun reçu disponible</p>
            <p className="text-gray-400 text-sm text-center max-w-xs">
              Ajoutez un locataire pour générer des reçus PDF.
            </p>
          </div>
        ) : (
          tenants.map(tenant => {
            const totalAmount = tenant.rent * tenant.duration;
            const receiptNumber = String(tenant.receiptCount || 1).padStart(3, '0');

            return (
              <div
                key={tenant.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-4 overflow-hidden"
              >
                {/* En-tête carte */}
                <div className="bg-gradient-to-br from-accent to-accent-dark p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                      N° {receiptNumber}
                    </span>
                    <FileText size={18} className="text-white/70" />
                  </div>
                  <p className="text-white font-bold">
                    {tenant.civility} {tenant.name}
                  </p>
                  {tenant.phone && (
                    <p className="text-white/70 text-sm mt-0.5">{tenant.phone}</p>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <DollarSign size={14} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="font-bold text-gray-800 dark:text-white text-sm">
                          {formatNumber(totalAmount)} FCFA
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <Clock size={14} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Durée</p>
                        <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                          {tenant.duration} mois
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                      <Calendar size={14} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Période</p>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                        {formatDate(tenant.startDate)} → {formatDate(tenant.endDate)}
                      </p>
                    </div>
                  </div>

                  {tenant.advance > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Avance</span>
                        <span className="font-semibold text-accent">
                          {formatNumber(tenant.advance)} FCFA
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-400">Reste</span>
                        <span className="font-semibold text-red-500">
                          {formatNumber(tenant.reste)} FCFA
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleReceipt(tenant)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-dark text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                  >
                    <Download size={16} />
                    Générer le reçu PDF
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}