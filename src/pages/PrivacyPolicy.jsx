import { ArrowLeft, Shield, Database, Lock, Eye, Mail, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

export default function PrivacyPolicy({ onBack }) {
  
  // Scroll en haut à l'ouverture
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pt-12 pb-8 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Retour</span>
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">Politique de confidentialité</h1>
        </div>
        <p className="text-white/70 text-sm">Dernière mise à jour : juin 2026</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Intro */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            SmartBay est une application web de gestion locative développée et exploitée par son fondateur,
            basée au Cameroun. Nous prenons la protection de vos données personnelles très au sérieux.
            Cette politique décrit quelles données nous collectons, pourquoi et comment nous les utilisons.
          </p>
        </div>

        {/* Section 1 */}
        <Section
          icon={Database}
          title="1. Données collectées"
          color="bg-blue-50 dark:bg-blue-900/20 text-blue-500"
        >
          <p>Lors de votre inscription et utilisation de SmartBay, nous collectons :</p>
          <ul className="mt-3 space-y-2">
            <Item>Votre <strong>nom complet</strong> et <strong>adresse email</strong> (lors de la création de compte)</Item>
            <Item>Les <strong>informations de vos locataires</strong> que vous saisissez (nom, téléphone, montant du loyer, dates de location)</Item>
            <Item>Les <strong>données de connexion</strong> (date d&#39;inscription, dernière connexion) gérées par Firebase Authentication</Item>
            <Item>Les <strong>données de navigation</strong> basiques pour le bon fonctionnement de l&#39;application</Item>
          </ul>
          <Note>Nous ne collectons pas de données sensibles telles que les numéros de carte bancaire, données biométriques ou informations médicales.</Note>
        </Section>

        {/* Section 2 */}
        <Section
          icon={Eye}
          title="2. Utilisation des données"
          color="bg-purple-50 dark:bg-purple-900/20 text-purple-500"
        >
          <p>Vos données sont utilisées exclusivement pour :</p>
          <ul className="mt-3 space-y-2">
            <Item>Vous permettre de <strong>gérer vos locataires</strong> et générer des reçus PDF</Item>
            <Item>Assurer la <strong>synchronisation de vos données</strong> entre vos appareils via Firebase Firestore</Item>
            <Item>Vous envoyer des <strong>alertes d&#39;expiration</strong> de baux si vous les activez</Item>
            <Item>Améliorer les fonctionnalités de l&#39;application</Item>
          </ul>
          <Note>Nous ne vendons, ne louons et ne partageons jamais vos données personnelles à des tiers à des fins commerciales.</Note>
        </Section>

        {/* Section 3 */}
        <Section
          icon={Lock}
          title="3. Sécurité des données"
          color="bg-green-50 dark:bg-green-900/20 text-green-500"
        >
          <p>Vos données sont protégées par :</p>
          <ul className="mt-3 space-y-2">
            <Item><strong>Firebase Authentication</strong> de Google pour la gestion sécurisée des comptes</Item>
            <Item><strong>Firebase Firestore</strong> avec des règles de sécurité strictes — chaque utilisateur n&#39;accède qu&#39;à ses propres données</Item>
            <Item>Des <strong>connexions chiffrées</strong> (HTTPS) pour toutes les communications</Item>
            <Item>Un accès aux données <strong>strictement limité</strong> au fondateur pour des raisons de maintenance</Item>
          </ul>
        </Section>

        {/* Section 4 */}
        <Section
          icon={Database}
          title="4. Conservation des données"
          color="bg-orange-50 dark:bg-orange-900/20 text-orange-500"
        >
          <p>Vos données sont conservées :</p>
          <ul className="mt-3 space-y-2">
            <Item>Tant que votre <strong>compte est actif</strong></Item>
            <Item>Jusqu&#39;à <strong>30 jours</strong> après la suppression de votre compte, pour des raisons techniques</Item>
            <Item>Les données des locataires sont supprimées <strong>immédiatement</strong> lorsque vous les supprimez vous-même</Item>
          </ul>
        </Section>

        {/* Section 5 */}
        <Section
          icon={Eye}
          title="5. Partage des données"
          color="bg-red-50 dark:bg-red-900/20 text-red-500"
        >
          <p>Vos données peuvent être partagées uniquement avec :</p>
          <ul className="mt-3 space-y-2">
            <Item><strong>Google Firebase</strong> (hébergement, authentification, base de données) — soumis à la politique de confidentialité de Google</Item>
            <Item>Les <strong>autorités compétentes</strong> uniquement si la loi camerounaise l&#39;exige</Item>
          </ul>
          <Note>Aucun partage à des fins publicitaires ou commerciales.</Note>
        </Section>

        {/* Section 6 */}
        <Section
          icon={Shield}
          title="6. Vos droits"
          color="bg-accent/10 text-accent"
        >
          <p>Vous disposez des droits suivants sur vos données :</p>
          <ul className="mt-3 space-y-2">
            <Item><strong>Droit d'accès</strong> — consulter toutes vos données depuis les paramètres SmartBay</Item>
            <Item><strong>Droit de rectification</strong> — modifier vos informations à tout moment</Item>
            <Item><strong>Droit de suppression</strong> — supprimer votre compte et toutes vos données depuis les paramètres</Item>
            <Item><strong>Droit de portabilité</strong> — nous contacter pour obtenir une copie de vos données</Item>
          </ul>
        </Section>

        {/* Section 7 */}
        <Section
          icon={Mail}
          title="7. Cookies"
          color="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600"
        >
          <p>
            SmartBay peut utiliser des mécanismes techniques de stockage local 
            du navigateur afin de maintenir la session utilisateur et mémoriser 
            certaines préférences, comme le thème de l'application. SmartBay n'utilise 
            pas de cookies publicitaires ni d'outils de suivi marketing tiers.
          </p>
        </Section>

        {/* Section 8 */}
        <Section
          icon={Trash2}
          title="8. Suppression du compte"
          color="bg-red-50 dark:bg-red-900/20 text-red-500"
        >
          <p>
            Pour supprimer votre compte et toutes vos données, rendez-vous dans
            <strong> Paramètres → Supprimer les données</strong>. Toutes vos informations
            seront définitivement supprimées dans un délai de 30 jours.
          </p>
        </Section>

        {/* Contact */}
        <div className="bg-gradient-to-br from-accent/10 to-accent-dark/10 rounded-2xl p-6 border border-accent/20">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Contact</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Pour toute question relative à cette politique de confidentialité ou à vos données personnelles,
            contactez-nous à :
          </p>
            <a
            href="mailto:getsmartbay@gmail.com"
            className="inline-flex items-center gap-2 mt-3 text-accent font-semibold text-sm hover:underline"
          >
            <Mail size={16} />
            getsmartbay@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}

// Composants internes
function Section({ icon: Icon, title, color, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon size={18} />
        </div>
        <h2 className="font-bold text-gray-800 dark:text-white">{title}</h2>
      </div>
      <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

function Item({ children }) {
  return (
    <li className="flex items-start gap-2 list-none">
      <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1.5" />
      <span>{children}</span>
    </li>
  );
}

function Note({ children }) {
  return (
    <div className="mt-3 bg-accent/10 border border-accent/20 rounded-xl p-3">
      <p className="text-accent text-xs font-medium">{children}</p>
    </div>
  );
}