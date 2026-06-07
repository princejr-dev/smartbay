import { useEffect } from 'react';
import { ArrowLeft, FileText, CheckCircle, XCircle, Mail, AlertCircle, Users, Shield, Scale } from 'lucide-react';

export default function TermsOfService({ onBack }) {
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
            <FileText size={20} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">
            Conditions Générales d&#39;Utilisation
          </h1>
        </div>
        <p className="text-white/70 text-sm">Dernière mise à jour : Juin 2026</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Intro */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Bienvenue sur <strong>SmartBay</strong>, une application web de gestion locative
            développée et exploitée par son fondateur, basée au Cameroun. En accédant à SmartBay
            et en utilisant ses services, vous acceptez sans réserve les présentes Conditions
            Générales d&#39;Utilisation (CGU). Veuillez les lire attentivement avant toute utilisation.
          </p>
        </div>

        {/* Section 1 */}
        <Section icon={FileText} title="1. Présentation du service" color="bg-blue-50 dark:bg-blue-900/20 text-blue-500">
          <p>SmartBay est une application web permettant aux propriétaires immobiliers de :</p>
          <ul className="mt-3 space-y-2">
            <Item>Gérer leurs locataires (ajout, modification, suppression)</Item>
            <Item>Générer des reçus de loyer en format PDF partageables</Item>
            <Item>Suivre les dates d&#39;expiration des baux et recevoir des alertes</Item>
            <Item>Accéder à leurs données depuis n&#39;importe quel appareil connecté</Item>
          </ul>
          <Note>SmartBay est un outil de gestion. Il n&#39;est pas un service juridique, financier ou notarial. Les reçus générés sont fournis à titre indicatif.</Note>
        </Section>

        {/* Section 2 */}
        <Section icon={Users} title="2. Accès au service" color="bg-purple-50 dark:bg-purple-900/20 text-purple-500">
          <p>Pour utiliser SmartBay, vous devez :</p>
          <ul className="mt-3 space-y-2">
            <Item>Créer un compte avec une adresse email valide et un mot de passe sécurisé</Item>
            <Item>Être âgé d&#39;au moins <strong>18 ans</strong></Item>
            <Item>Disposer d&#39;une connexion internet fonctionnelle</Item>
            <Item>Utiliser le service à des fins <strong>légales et licites</strong> uniquement</Item>
          </ul>
          <p className="mt-3">
            SmartBay se réserve le droit de suspendre ou supprimer tout compte en cas de violation
            des présentes CGU, sans préavis ni remboursement.
          </p>
        </Section>

        {/* Section 3 */}
        <Section icon={CheckCircle} title="3. Utilisation autorisée" color="bg-green-50 dark:bg-green-900/20 text-green-500">
          <p>Vous êtes autorisé à :</p>
          <ul className="mt-3 space-y-2">
            <Item>Utiliser SmartBay pour gérer vos propres biens immobiliers en location</Item>
            <Item>Générer et partager des reçus PDF avec vos locataires</Item>
            <Item>Accéder à vos données depuis plusieurs appareils avec le même compte</Item>
            <Item>Exporter et utiliser vos données personnelles conformément à la politique de confidentialité</Item>
          </ul>
        </Section>

        {/* Section 4 */}
        <Section icon={XCircle} title="4. Utilisations interdites" color="bg-red-50 dark:bg-red-900/20 text-red-500">
          <p>Il est strictement interdit de :</p>
          <ul className="mt-3 space-y-2">
            <Item>Utiliser SmartBay à des fins <strong>frauduleuses ou illégales</strong></Item>
            <Item>Saisir des données de locataires <strong>sans leur consentement</strong></Item>
            <Item>Tenter de <strong>pirater, contourner ou perturber</strong> le fonctionnement de l&#39;application</Item>
            <Item>Revendre, reproduire ou exploiter commercialement SmartBay sans autorisation</Item>
            <Item>Utiliser des robots ou scripts automatisés pour accéder au service</Item>
            <Item>Usurper l&#39;identité d&#39;un autre utilisateur</Item>
          </ul>
          <Note>Toute violation de ces interdictions peut entraîner la suspension immédiate du compte et des poursuites judiciaires.</Note>
        </Section>

        {/* Section 5 */}
        <Section icon={Shield} title="5. Responsabilités" color="bg-orange-50 dark:bg-orange-900/20 text-orange-500">
          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Responsabilités de l&#39;utilisateur</p>
          <ul className="space-y-2">
            <Item>Vous êtes seul responsable des données que vous saisissez dans SmartBay</Item>
            <Item>Vous garantissez avoir obtenu le consentement de vos locataires pour traiter leurs données</Item>
            <Item>Vous êtes responsable de la confidentialité de vos identifiants de connexion</Item>
            <Item>Vous vous engagez à utiliser les reçus générés de manière honnête et transparente</Item>
          </ul>

          <p className="font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-2">Responsabilités de SmartBay</p>
          <ul className="space-y-2">
            <Item>Nous nous engageons à maintenir le service disponible dans la mesure du possible</Item>
            <Item>Nous ne sommes pas responsables des interruptions techniques indépendantes de notre volonté</Item>
            <Item>Nous ne garantissons pas la valeur juridique des reçus générés automatiquement, consultez un professionnel pour tout litige</Item>
            <Item>Nous ne sommes pas responsables des erreurs de données saisies par l&#39;utilisateur</Item>
          </ul>
        </Section>

        {/* Section 6 */}
        <Section icon={FileText} title="6. Propriété intellectuelle" color="bg-accent/10 text-accent">
          <p>
            SmartBay ainsi que ses éléments visuels, son code source, ses contenus, son identité graphique et 
            ses fonctionnalités sont la propriété de leur auteur.
          </p>
          <ul className="mt-3 space-y-2">
            <Item>Toute reproduction, modification ou exploitation non autorisée est interdite.</Item>
            <Item>Les données que vous saisissez dans SmartBay restent votre propriété</Item>
            <Item>Vous accordez à SmartBay une licence limitée pour traiter vos données dans le seul but de fournir le service</Item>
          </ul>
        </Section>

        {/* Section 7 */}
        <Section icon={AlertCircle} title="7. Disponibilité du service" color="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600">
          <p>
            SmartBay s&#39;efforce de maintenir le service disponible 24h/24 et 7j/7. Cependant,
            des interruptions peuvent survenir pour des raisons de maintenance, mises à jour ou
            incidents techniques. Nous ne saurions être tenus responsables de ces indisponibilités.
          </p>
          <ul className="mt-3 space-y-2">
            <Item>Les maintenances planifiées seront annoncées dans l&#39;application si possible</Item>
            <Item>SmartBay se réserve le droit de modifier, suspendre ou arrêter le service à tout moment</Item>
          </ul>
        </Section>

        {/* Section 8 */}
        <Section icon={Scale} title="8. Droit applicable et litiges" color="bg-gray-50 dark:bg-gray-700/50 text-gray-500">
          <p>
            Les présentes CGU sont régies par le droit camerounais. En cas de litige relatif à
            l&#39;utilisation de SmartBay, les parties s&#39;engagent à rechercher une solution amiable
            avant tout recours judiciaire.
          </p>
          <ul className="mt-3 space-y-2">
            <Item>Tout litige sera soumis aux tribunaux compétents de <strong>Douala, Cameroun</strong></Item>
            <Item>La langue applicable est le <strong>français</strong></Item>
          </ul>
        </Section>

        {/* Section 9 */}
        <Section icon={FileText} title="9. Modifications des CGU" color="bg-blue-50 dark:bg-blue-900/20 text-blue-500">
          <p>
            SmartBay se réserve le droit de modifier les présentes CGU à tout moment. Les
            utilisateurs seront informés de toute modification importante par email ou via
            une notification dans l&#39;application. La poursuite de l&#39;utilisation du service
            après modification vaut acceptation des nouvelles CGU.
          </p>
        </Section>

        {/* Contact */}
        <div className="bg-gradient-to-br from-accent/10 to-accent-dark/10 rounded-2xl p-6 border border-accent/20">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Contact</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Pour toute question relative aux présentes CGU, contactez-nous à :
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