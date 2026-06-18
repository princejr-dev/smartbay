import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Bell,
  ChevronRight,
  Menu,
  Moon,
  Receipt,
  Shield,
  Smartphone,
  Users,
  X,
  Mail,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Données des cartes de fonctionnalités affichées sur la landing page.
const features = [
  {
    icon: Users,
    title: 'Gestion des locataires',
    desc: 'Ajoutez, modifiez et suivez tous vos locataires en un seul endroit.',
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
  },
  {
    icon: Receipt,
    title: 'Reçus PDF automatiques',
    desc: 'Générez des reçus professionnels en un clic et partagez-les à vos locataires.',
    color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-500',
  },
  {
    icon: Bell,
    title: "Alertes d'expiration",
    desc: "Recevez des alertes avant l'expiration des baux pour ne jamais rater un renouvellement.",
    color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-500',
  },
  {
    icon: Moon,
    title: 'Mode sombre',
    desc: 'Interface adaptée à vos préférences avec un mode sombre élégant.',
    color: 'bg-gray-50 dark:bg-gray-700/50 text-gray-500',
  },
  {
    icon: Shield,
    title: 'Données sécurisées',
    desc: 'Vos données sont stockées sur le cloud et en toute sécurité.',
    color: 'bg-green-50 dark:bg-green-900/20 text-green-500',
  },
  {
    icon: Smartphone,
    title: 'Responsive',
    desc: 'Utilisez SmartBay sur mobile, tablette ou ordinateur sans contrainte.',
    color: 'bg-accent/10 text-accent',
  },
];

// Étapes affichées dans la section "Comment ça marche ?".
const steps = [
  {
    number: '01',
    title: 'Créez un locataire',
    desc: 'Remplissez les informations du locataire : nom, loyer, durée et date de début.',
  },
  {
    number: '02',
    title: 'Générez un reçu',
    desc: 'En un clic, un reçu PDF professionnel est généré et prêt à être partagé.',
  },
  {
    number: '03',
    title: 'Recevez des alertes',
    desc: "SmartBay vous avertit avant l'expiration du bail pour agir à temps.",
  },
];

export default function Landing({ onEnterApp, onNavigateLegal }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Initialise les animations au scroll une seule fois au montage du composant.
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  // Ferme le menu mobile avant de laisser App.jsx gérer l'entrée dans l'app.
  const handleEnterApp = () => {
    setMenuOpen(false);
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-white font-sans dark:bg-gray-900">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/favicon.webp" alt="SmartBay" className="h-8 w-8 rounded" />
            <span className="font-audiowide text-xl text-accent">SmartBay</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-gray-600 transition-colors hover:text-accent dark:text-gray-300 dark:hover:text-accent"
            >
              Fonctionnalités
            </a>
            <a
              href="#how"
              className="text-sm text-gray-600 transition-colors hover:text-accent dark:text-gray-300 dark:hover:text-accent"
            >
              Comment ça marche ?
            </a>
            <button
              onClick={() => onNavigateLegal('blog')}
              className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors text-sm"
            >
              Blog
            </button>
            <button
              type="button"
              onClick={handleEnterApp}
              className="rounded-xl bg-gradient-to-r from-accent to-accent-dark px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
            >
              Accéder à l&apos;app
            </button>
          </div>

          <button
            type="button"
            className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={22} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu size={22} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="animate-fade-in absolute right-6 top-16 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 md:hidden">
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-4 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Fonctionnalités
            </a>
            <a
              href="#how"
              onClick={() => setMenuOpen(false)}
              className="block border-t border-gray-100 px-5 py-4 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Comment ça marche ?
            </a>
            <a
              onClick={() => onNavigateLegal('blog')}
              className="block border-t border-gray-100 px-5 py-4 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Blog
            </a>
            <button
              type="button"
              onClick={handleEnterApp}
              className="w-full border-t border-gray-100 bg-accent px-5 py-4 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-dark dark:border-gray-800"
            >
              Accéder à l&apos;app
            </button>
          </div>
        )}
      </nav>

      <section
        data-aos="fade-up"
        className="bg-gradient-to-br from-accent/5 via-white to-accent-dark/5 px-6 pb-20 pt-32 dark:from-accent/10 dark:via-gray-900 dark:to-accent-dark/10"
      >
        <div className="mx-auto max-w-4xl text-center">
          <div
            data-aos="fade-up"
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent"
          >
            <AlertCircle size={14} />
            Gestion locative simplifiée
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white md:text-6xl">
            Gérez vos locataires
            <span className="bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
              {' '}
              en toute simplicité
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-500 dark:text-gray-400 md:text-xl">
            SmartBay vous permet de suivre vos locataires, générer des reçus PDF professionnels
            et recevoir des alertes avant l&apos;expiration des baux.
          </p>

          <div data-aos="fade-up" className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleEnterApp}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-dark px-8 py-4 text-base font-bold text-white shadow-lg shadow-accent/30 transition-all hover:scale-105 hover:opacity-90"
            >
              Commencer à gérer
              <ChevronRight size={20} />
            </button>
            <a
              href="#features"
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-all hover:border-accent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-accent"
            >
              Voir les fonctionnalités
            </a>
          </div>
        </div>
      </section>

      <section
        data-aos="fade-up"
        id="features"
        className="bg-gray-50 px-6 py-20 dark:bg-gray-800/50"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mx-auto max-w-xl text-gray-500 dark:text-gray-400">
              Une application simple et efficace pour les propriétaires immobiliers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, color }, index) => (
              <div
                key={title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:bg-gray-800"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                  <Icon size={22} />
                </div>

                <h3 className="mb-2 font-bold text-gray-800 dark:text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-aos="fade-up" id="how" className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Comment ça marche ?
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Trois étapes simples pour gérer vos locataires.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {steps.map(({ number, title, desc }, index) => (
              <div
                key={number}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="flex items-start gap-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-dark text-lg font-bold text-white">
                  {number}
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        data-aos="fade-up"
        className="bg-gradient-to-br from-accent to-accent-dark px-6 py-20"
      >
        <div className="mx-auto max-w-2xl text-center">
          <img src="/favicon.webp" alt="SmartBay" className="mx-auto mb-6 h-16 w-16 rounded-xl" />
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Prêt à simplifier votre gestion ?
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Rejoignez SmartBay et gérez vos locataires en toute sérénité.
          </p>
          <button
            type="button"
            onClick={handleEnterApp}
            data-aos="fade-up"
            className="rounded-2xl bg-white px-8 py-4 text-base font-bold text-accent shadow-lg transition-all hover:scale-105"
          >
            Accéder à l&apos;application
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <img src="/favicon.webp" alt="SmartBay" className="h-6 w-6 rounded" />
              <span className="font-audiowide text-white">SmartBay</span>
            </div>
            <p className="text-center text-sm font-semibold text-gray-500">
              Gestion locative intelligente
            </p>
          </div>

          <div className="mb-6 h-px bg-gray-800" />

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              &copy; 2026 SmartBay. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => onNavigateLegal('privacy')}
                className="text-sm text-gray-400 transition-colors hover:text-accent"
              >
                Politique de confidentialité
              </button>
              <span className="text-gray-700">•</span>
              <button
                type="button"
                onClick={() => onNavigateLegal('terms')}
                className="text-sm text-gray-400 transition-colors hover:text-accent"
              >
                CGU
              </button>
              <span className="text-gray-700">•</span>
              <a
                href="mailto:getsmartbay@gmail.com"
                className="text-sm text-gray-400 transition-colors hover:text-accent"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
