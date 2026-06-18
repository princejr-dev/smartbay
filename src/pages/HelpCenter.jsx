import { useState } from 'react';
import { ArrowLeft, HelpCircle, Shield, FileText, Mail, MessageCircle, Info, ChevronRight } from 'lucide-react';

export default function HelpCenter({ onBack, onNavigateLegal }) {

  const faqs = [
    {
      question: 'Comment ajouter un locataire ?',
      answer: 'Cliquez sur le bouton "+" en bas à droite de l\'écran. Remplissez les informations du locataire et cliquez sur "Enregistrer".',
    },
    {
      question: 'Comment générer un reçu PDF ?',
      answer: 'Depuis la liste des locataires, cliquez sur le bouton "Reçu" sur la carte du locataire concerné. Le reçu s\'ouvre automatiquement pour impression ou téléchargement.',
    },
    {
      question: 'Comment modifier un locataire ?',
      answer: 'Cliquez sur le bouton "Modifier" sur la carte du locataire. Modifiez les informations souhaitées et cliquez sur "Enregistrer".',
    },
    {
      question: 'Comment fonctionne le système d\'alertes ?',
      answer: 'SmartBay vous avertit automatiquement quand un bail expire ou est sur le point d\'expirer (dans les 7 jours). Les alertes apparaissent sur le tableau de bord et dans la page Alertes.',
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Oui. Vos données sont stockées sur Firebase (Google) avec des règles de sécurité strictes. Chaque utilisateur n\'accède qu\'à ses propres données.',
    },
    {
      question: 'Comment réinitialiser mon mot de passe ?',
      answer: 'Sur la page de connexion, cliquez sur "Mot de passe oublié ?". Entrez votre email et vous recevrez un lien de réinitialisation.',
    },
    {
      question: 'Qu\'est-ce que le dossier locataire ?',
      answer: 'Le dossier locataire regroupe toutes les informations d\'un locataire : ses infos personnelles, ses paiements enregistrés et vos notes internes.',
    },
    {
      question: 'Comment archiver un locataire ?',
      answer: 'Dans la page Dossiers, cliquez sur les 3 points en haut à droite de la carte du locataire, puis choisissez "Archiver le locataire".',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pt-12 pb-8 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold">Centre d&#39;aide</h1>
        </div>
      </div>

      <div className="px-5 pt-5 pb-10">

        {/* Contact */}
        <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center p-2">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold">Besoin d&#39;aide ?</p>
              <p className="text-white/70 text-sm">N'hésitez pas à nous écrire. Nous vous répondrons sous peu.</p>
            </div>
          </div>
          <a
            href="mailto:getsmartbay@gmail.com"
            className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Mail size={16} />
            Nous contacter !
          </a>
        </div>

        {/* FAQ */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
          Questions fréquentes
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 overflow-hidden">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isLast={index === faqs.length - 1}
            />
          ))}
        </div>

        {/* Légal */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
          Informations légales
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => onNavigateLegal('privacy')}
            className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <Shield size={16} className="text-accent" />
              </div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">
                Politique de confidentialité
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>

          <button
            onClick={() => onNavigateLegal('terms')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <FileText size={16} className="text-accent" />
              </div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">
                Conditions générales d&#39;utilisation
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>

        {/* À propos */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
          À propos
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <Info size={16} className="text-accent" />
              </div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">Version</p>
            </div>
            <span className="text-gray-400 text-sm">v1.1.3</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <HelpCircle size={16} className="text-accent" />
              </div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">Développé par</p>
            </div>
            <span className="text-gray-400 text-sm">SmartBay</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Composant FAQ avec accordéon
function FaqItem({ question, answer, isLast }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={!isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
      >
        <p className="font-semibold text-gray-800 dark:text-white text-sm pr-4">{question}</p>
        <ChevronRight
          size={16}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}