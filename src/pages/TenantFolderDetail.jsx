import { useState, useEffect } from 'react';
import {
  ArrowLeft, User, Phone, Calendar, DollarSign,
  FileText, MessageSquare, Plus, Trash2, Send,
  CheckCircle, AlertCircle, Clock, Download
} from 'lucide-react';
import { fetchPayments, addPayment, deletePayment, fetchNotes, addNote, deleteNote } from '../utils/firestore';
import { formatDate, formatNumber, getDaysUntilExpiry } from '../utils/helpers';
import { generateReceipt } from '../utils/receipt';

export default function TenantFolderDetail({ tenant, user, onBack }) {
  // États pour les paiements et notes
  const [payments, setPayments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);

  // État pour l'ajout de paiement
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // État pour l'ajout de note
  const [newNote, setNewNote] = useState('');

  // Onglet actif : 'info' | 'payments' | 'notes'
  const [activeTab, setActiveTab] = useState('info');

  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Charge les paiements du locataire
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPayments(tenant.id);
        setPayments(data);
      } catch (err) {
        console.error('Erreur chargement paiements:', err);
      } finally {
        setLoadingPayments(false);
      }
    };
    load();
  }, [tenant.id]);

  // Charge les notes du locataire
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNotes(tenant.id);
        setNotes(data);
      } catch (err) {
        console.error('Erreur chargement notes:', err);
      } finally {
        setLoadingNotes(false);
      }
    };
    load();
  }, [tenant.id]);

  // Ajoute un paiement
  const handleAddPayment = async () => {
    if (!paymentAmount || isNaN(paymentAmount)) return;
    try {
      const payment = await addPayment(user.uid, tenant.id, {
        amount: parseInt(paymentAmount),
        date: paymentDate,
        receiptNumber: String(payments.length + 1).padStart(3, '0'),
      });
      setPayments(prev => [payment, ...prev]);
      setPaymentAmount('');
      setShowPaymentForm(false);
      showToast('✅ Paiement enregistré !');
    } catch (err) {
      console.error('Erreur ajout paiement:', err);
    }
  };

  // Supprime un paiement
  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm('Supprimer ce paiement ?')) return;
    try {
      await deletePayment(paymentId);
      setPayments(prev => prev.filter(p => p.id !== paymentId));
      showToast('🗑 Paiement supprimé !');
    } catch (err) {
      console.error('Erreur suppression paiement:', err);
    }
  };

  // Ajoute une note
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const note = await addNote(user.uid, tenant.id, newNote.trim());
      setNotes(prev => [note, ...prev]);
      setNewNote('');
      showToast('📝 Note ajoutée !');
    } catch (err) {
      console.error('Erreur ajout note:', err);
    }
  };

  // Supprime une note
  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes(prev => prev.filter(n => n.id !== noteId));
      showToast('🗑 Note supprimée !');
    } catch (err) {
      console.error('Erreur suppression note:', err);
    }
  };

  // Génère le reçu PDF
  const handleReceipt = () => {
    generateReceipt(tenant);
    showToast('📄 Reçu généré !');
  };

  // Statut du locataire
  const days = getDaysUntilExpiry(tenant.endDate);
  const isExpired = days < 0;
  const isExpiringSoon = days >= 0 && days <= 7;

  const statusConfig = isExpired
    ? { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', icon: AlertCircle, label: `En retard — ${Math.abs(days)}j` }
    : isExpiringSoon
    ? { color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', icon: Clock, label: `Expire dans ${days}j` }
    : { color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', icon: CheckCircle, label: 'Actif' };

  const StatusIcon = statusConfig.icon;

  // Total des paiements effectués
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalDue = tenant.rent * tenant.duration;
  const remaining = Math.max(0, totalDue - totalPaid);

  const tabs = [
    { key: 'info', label: 'Informations', icon: User },
    { key: 'payments', label: `Paiements (${payments.length})`, icon: DollarSign },
    { key: 'notes', label: `Notes (${notes.length})`, icon: MessageSquare },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">

      {/* Bouton retour */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-accent transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft size={18} />
        Retour aux dossiers
      </button>

      {/* En-tête dossier */}
      <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-2xl font-bold">
                {tenant.name ? tenant.name[0].toUpperCase() : 'L'}
              </span>
            </div>
            <div>
              <p className="text-white font-bold text-xl">
                {tenant.civility} {tenant.name}
              </p>
              {tenant.phone && (
                <p className="text-white/70 text-sm mt-1">{tenant.phone}</p>
              )}
              {/* Badge statut */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-2 bg-white/20`}>
                <StatusIcon size={12} />
                {statusConfig.label}
              </div>
            </div>
          </div>

          {/* Action rapide reçu */}
          <button
            onClick={handleReceipt}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Download size={16} />
            Reçu PDF
          </button>
        </div>

        {/* Résumé financier */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-white/70 text-xs mb-1">Loyer mensuel</p>
            <p className="text-white font-bold">{formatNumber(tenant.rent)} FCFA</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-white/70 text-xs mb-1">Total payé</p>
            <p className="text-white font-bold">{formatNumber(totalPaid)} FCFA</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-white/70 text-xs mb-1">Reste dû</p>
            <p className="text-white font-bold">{formatNumber(remaining)} FCFA</p>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 rounded-2xl p-1.5 shadow-sm">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${activeTab === key
                ? 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-accent'
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ===== ONGLET INFORMATIONS ===== */}
      {activeTab === 'info' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-800 dark:text-white mb-5">Informations complètes</h2>

          <div className="grid grid-cols-2 gap-5">
            {/* Nom */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Nom complet</p>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">
                  {tenant.civility} {tenant.name}
                </p>
              </div>
            </div>

            {/* Téléphone */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Téléphone</p>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">
                  {tenant.phone || 'Non renseigné'}
                </p>
              </div>
            </div>

            {/* Loyer */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <DollarSign size={16} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Loyer mensuel</p>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">
                  {formatNumber(tenant.rent)} FCFA
                </p>
              </div>
            </div>

            {/* Durée */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Durée</p>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">
                  {tenant.duration} mois
                </p>
              </div>
            </div>

            {/* Date entrée */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Calendar size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Date d&#39;entrée</p>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">
                  {formatDate(tenant.startDate)}
                </p>
              </div>
            </div>

            {/* Date expiration */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isExpired ? 'bg-red-50 dark:bg-red-900/20' : 'bg-accent/10'}`}>
                <Calendar size={16} className={isExpired ? 'text-red-500' : 'text-accent'} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Date d&#39;expiration</p>
                <p className={`font-semibold text-sm ${isExpired ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                  {formatDate(tenant.endDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Avance / Reste */}
          {tenant.advance > 0 && (
            <div className="mt-5 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">Avance versée</p>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-400">Avance</p>
                  <p className="font-bold text-accent">{formatNumber(tenant.advance)} FCFA</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Reste à payer</p>
                  <p className="font-bold text-red-500">{formatNumber(tenant.reste)} FCFA</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== ONGLET PAIEMENTS ===== */}
      {activeTab === 'payments' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-800 dark:text-white">Historique des paiements</h2>
            <button
              onClick={() => setShowPaymentForm(!showPaymentForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-accent to-accent-dark text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            >
              <Plus size={15} />
              Ajouter
            </button>
          </div>

          {/* Formulaire ajout paiement */}
          {showPaymentForm && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-5 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Montant (FCFA)</label>
                <input
                  type="number"
                  placeholder="Montant"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:border-accent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:border-accent"
                />
              </div>
              <button
                onClick={handleAddPayment}
                className="bg-gradient-to-r from-accent to-accent-dark text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90"
              >
                Enregistrer
              </button>
            </div>
          )}

          {/* Liste paiements */}
          {loadingPayments ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aucun paiement enregistré</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {payments.map((payment, index) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">
                        {formatNumber(payment.amount)} FCFA
                      </p>
                      <p className="text-xs text-gray-400">
                        {payment.date ? formatDate(payment.date) : 'Date inconnue'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                      N° {String(payments.length - index).padStart(3, '0')}
                    </span>
                    <button
                      onClick={() => handleDeletePayment(payment.id)}
                      className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== ONGLET NOTES ===== */}
      {activeTab === 'notes' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-800 dark:text-white mb-5">Notes internes</h2>

          {/* Champ ajout note */}
          <div className="flex gap-3 mb-5">
            <input
              type="text"
              placeholder="Ajouter une note..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddNote()}
              className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-800 dark:text-white outline-none focus:border-accent transition-colors"
            />
            <button
              onClick={handleAddNote}
              className="w-10 h-10 bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-all flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Liste notes */}
          {loadingNotes ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aucune note pour ce locataire</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notes.map(note => (
                <div key={note.id} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageSquare size={14} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{note.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {note.createdAt?.toDate
                          ? note.createdAt.toDate().toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'long', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })
                          : 'À l\'instant'
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={13} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 dark:bg-gray-700 text-white py-3 px-5 rounded-xl shadow-xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}