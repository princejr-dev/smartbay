import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, DollarSign, Clock } from 'lucide-react';
import { fetchTenants, updateTenant } from '../utils/firestore';
import { formatDate, formatNumber } from '../utils/helpers';
import { generateReceipt } from '../utils/receipt';

export default function PCReceipts({ user }) {
  const [tenants, setTenants] = useState([]);

  // Charge les locataires au montage
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

  // Filtre uniquement les locataires ayant au moins un reçu généré
  const tenantsWithReceipts = tenants;

  // Gère la génération du reçu PDF
  const handleReceipt = async (tenant) => {
  generateReceipt(tenant);

  const newCount = (tenant.receiptCount || 0) + 1;

  try {
    await updateTenant(tenant.id, {
      receiptCount: newCount
    });

    setTenants(prev =>
      prev.map(t =>
        t.id === tenant.id ? { ...t, receiptCount: newCount } : t
      )
    );
  } catch (err) {
    console.error('Erreur update receipt:', err);
  }
};

  return (
    <div className="p-8">

      {/* Titre */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reçus</h1>
        <p className="text-gray-400 text-sm mt-1">
          {tenants.length} locataire{tenants.length > 1 ? 's' : ''} — cliquez pour générer un reçu PDF
        </p>
      </div>

      {/* Aucun reçu */}
      {tenantsWithReceipts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
            <FileText size={32} className="text-accent" />
          </div>
          <p className="font-semibold text-gray-700 dark:text-white text-lg">Aucun reçu généré</p>
          <p className="text-gray-400 text-sm text-center max-w-sm">
            Les reçus apparaissent ici après avoir été générés depuis la page Locataires.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tenantsWithReceipts.map(tenant => {
            const totalAmount = tenant.rent * tenant.duration;
            const receiptNumber = String(tenant.receiptCount || 1).padStart(3, '0');

            return (
              <div
                key={tenant.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden"
              >
                {/* En-tête carte avec gradient */}
                <div className="bg-gradient-to-br from-accent to-accent-dark p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                      N° {receiptNumber}
                    </span>
                    <FileText size={20} className="text-white/70" />
                  </div>
                  <p className="text-white font-bold text-lg">
                    {tenant.civility} {tenant.name}
                  </p>
                  {tenant.phone && (
                    <p className="text-white/70 text-sm mt-1">{tenant.phone}</p>
                  )}
                </div>

                {/* Contenu carte */}
                <div className="p-5">

                  {/* Montant total */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Montant total</p>
                      <p className="font-bold text-gray-800 dark:text-white">
                        {formatNumber(totalAmount)} FCFA
                      </p>
                    </div>
                  </div>

                  {/* Durée */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <Clock size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Durée</p>
                      <p className="font-semibold text-gray-700 dark:text-gray-300">
                        {tenant.duration} mois
                      </p>
                    </div>
                  </div>

                  {/* Période */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                      <Calendar size={16} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Période</p>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                        {formatDate(tenant.startDate)} → {formatDate(tenant.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* Avance / Reste */}
                  {tenant.advance > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Avance</span>
                        <span className="font-semibold text-accent">{formatNumber(tenant.advance)} FCFA</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-400">Reste</span>
                        <span className="font-semibold text-red-500">{formatNumber(tenant.reste)} FCFA</span>
                      </div>
                    </div>
                  )}

                  {/* Bouton générer reçu */}
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
          })}
        </div>
      )}
    </div>
  );
}