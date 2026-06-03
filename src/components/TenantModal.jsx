import { useState } from 'react';
import { X, User, Phone, DollarSign, Calendar, Wallet } from 'lucide-react';
import { computeEndDate } from '../utils/helpers';

// Durées disponibles en mois
const DURATIONS = [1, 2, 3, 6, 12];

export default function TenantModal({ visible, tenant, onSave, onClose }) {

    // Valeurs initiales calculées à partir du tenant
  const initial = {
    civility: tenant?.civility || 'M.',
    name: tenant?.name || '',
    phone: tenant?.phone || '',
    rent: String(tenant?.rent || ''),
    duration: DURATIONS.includes(tenant?.duration) ? tenant?.duration : 1,
    customDuration: DURATIONS.includes(tenant?.duration) ? '' : String(tenant?.duration || ''),
    startDate: tenant?.startDate || '',
    advance: tenant?.advance ? String(tenant.advance) : '',
  };

  const [civility, setCivility] = useState(initial.civility);
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone);
  const [rent, setRent] = useState(initial.rent);
  const [duration, setDuration] = useState(initial.duration);
  const [customDuration, setCustomDuration] = useState(initial.customDuration);
  const [startDate, setStartDate] = useState(initial.startDate);
  const [advance, setAdvance] = useState(initial.advance);
  const [error, setError] = useState('');
  const [isRenewal, setIsRenewal] = useState(false);

  // Calcul automatique du total
const total = rent && (duration || customDuration)
  ? parseInt(rent || 0) *
    (duration === 0
      ? (parseInt(customDuration) || 1)
      : duration)
  : '';

// Calcul automatique du reste
const reste =
  total > 0
    ? Math.max(0, total - parseInt(advance || 0))
    : null;

// Sauvegarde du locataire
const handleSave = () => {
  if (!name.trim()) { setError('Le nom est obligatoire.'); return; }
  if (!rent || isNaN(rent)) { setError('Le loyer est obligatoire.'); return; }
  if (!startDate) { setError('La date de début est obligatoire.'); return; }

  const finalDuration = duration === 0 ? parseInt(customDuration) || 1 : duration;
  if (finalDuration < 1) { setError('La durée doit être au moins 1 mois.'); return; }

  const endDate = computeEndDate(startDate, finalDuration);
  const advanceAmount = advance ? parseInt(advance) : 0;
  const rentAmount = parseInt(rent);

  const data = {
    civility,
    name: name.trim(),
    phone: phone.trim(),
    rent: rentAmount,
    duration: finalDuration,
    startDate,
    endDate,
    advance: advanceAmount,
    reste: Math.max(0, (rentAmount * finalDuration) - advanceAmount),
    // Si renouvellement → incrémente, sinon garde le compteur existant
    receiptCount: isRenewal
      ? (tenant?.receiptCount || 1) + 1
      : (tenant?.receiptCount || 1),
  };

  // Ajoute l'id uniquement si modification (id Firestore = string)
  if (tenant?.id && typeof tenant.id === 'string') {
    data.id = tenant.id;
  }

  onSave(data);
};

  if (!visible) return null;

  return (
    // Fond semi-transparent
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
  
  {/* Conteneur scrollable centré */}
  <div className="h-full overflow-y-auto flex justify-center py-6 px-4">
    <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl p-8 h-fit">

        {/* Barre de handle */}
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-5" />

        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {tenant ? 'Modifier le locataire' : 'Ajouter un locataire'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
          >
            <X size={22} />
          </button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded-xl mb-4">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Civilité */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Civilité</label>
        <div className="flex gap-3 mb-4">
          {['M.', 'Mme'].map(c => (
            <button
              key={c}
              onClick={() => setCivility(c)}
              className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all
                ${civility === c
                  ? 'bg-accent border-accent text-white'
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Nom */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Nom complet *</label>
        <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-4 focus-within:border-accent">
          <User size={18} className="text-accent flex-shrink-0" />
          <input
            type="text"
            placeholder="Nom du locataire"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Téléphone */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Téléphone</label>
        <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-4 focus-within:border-accent">
          <Phone size={18} className="text-accent flex-shrink-0" />
          <input
            type="tel"
            placeholder="+237 6 XX XX XX XX"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Loyer */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Loyer mensuel (FCFA) *</label>
        <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-4 focus-within:border-accent">
          <DollarSign size={18} className="text-accent flex-shrink-0" />
          <input
            type="number"
            placeholder="Montant"
            value={rent}
            onChange={e => setRent(e.target.value)}
            className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Durée */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Durée</label>
        <div className="flex gap-2 mb-3 flex-wrap">
          {DURATIONS.map(d => (
            <button
              key={d}
              onClick={() => { setDuration(d); setCustomDuration(''); }}
              className={`px-4 py-2 rounded-xl font-semibold border-2 transition-all text-sm
                ${duration === d
                  ? 'bg-accent border-accent text-white'
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}
            >
              {d}m
            </button>
          ))}
          {/* Option personnalisée */}
          <button
            onClick={() => setDuration(0)}
            className={`px-4 py-2 rounded-xl font-semibold border-2 transition-all text-sm
              ${duration === 0
                ? 'bg-accent border-accent text-white'
                : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'
              }`}
          >
            Autre
          </button>
        </div>

        {/* Total à payer */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
          Total à payer <span className="text-xs">(calculé automatiquement)</span>
        </label>
        <div className="flex items-center gap-3 border-2 border-accent dark:border-accent rounded-xl px-4 mb-4">
          <Wallet size={18} className="text-accent flex-shrink-0" />
          <input
            type="number"
            placeholder="Montant total"
            value={total}
            readOnly
            className="flex-1 py-3 bg-transparent outline-none font-bold text-accent dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Champ durée personnalisée */}
        {duration === 0 && (
          <div className="flex items-center gap-3 border-2 border-accent rounded-xl px-4 mb-4">
            <Calendar size={18} className="text-accent flex-shrink-0" />
            <input
              type="number"
              placeholder="Nombre de mois"
              value={customDuration}
              onChange={e => setCustomDuration(e.target.value)}
              className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
              min="1"
            />
          </div>
        )}

        {/* Date de début */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Date de début *</label>
        <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-4 focus-within:border-accent">
          <Calendar size={18} className="text-accent flex-shrink-0" />
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white"
          />
        </div>

        {/* Avance */}
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
          Avance <span className="text-xs">(optionnel)</span>
        </label>
        <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 mb-4 focus-within:border-accent">
          <Wallet size={18} className="text-accent flex-shrink-0" />
          <input
            type="number"
            placeholder="Montant avancé"
            value={advance}
            onChange={e => setAdvance(e.target.value)}
            className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Reste calculé automatiquement */}
        {reste !== null && parseInt(advance) > 0 && (
          <div className="flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-xl p-3 mb-4">
            <span className="text-sm text-accent font-semibold">
              Reste à payer : {reste.toLocaleString()} FCFA
            </span>
          </div>
        )}

        {/* Bouton renouvellement — visible uniquement en modification */}
{tenant?.id && (
  <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 mb-3">
    <p className="text-xs text-accent font-semibold mb-2">
      Renouvellement de location
    </p>
    <p className="text-xs text-gray-400 mb-3">
      Incrémente le numéro de reçu (actuellement N°{String(tenant?.receiptCount || 1).padStart(3, '0')})
    </p>
    <button
      onClick={() => {
        setIsRenewal(true);
        handleSave();
      }}
      className="w-full py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:opacity-90 transition-all"
    >
      Renouveler le contrat → N°{String((tenant?.receiptCount || 1) + 1).padStart(3, '0')}
    </button>
  </div>
)}

        {/* Boutons */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-bold hover:opacity-90 transition-all"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}