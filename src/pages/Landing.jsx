import { useState, useEffect } from 'react';
import { Bell, Moon, Shield, ChevronRight, Menu, X,
  Users, Receipt, AlertCircle, Smartphone
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Landing({ onEnterApp }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
  AOS.init({
    duration: 800,
    once: true,
  });
}, []);

{/* Contrôle de l'opacité du bouton heart en fonction du scroll 
const [supportOpen, setSupportOpen] = useState(false); */}

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
      desc: 'Générez des reçus professionnels en un clic et partagez-les via WhatsApp.',
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
      desc: 'Vos données sont stockées localement sur votre appareil en toute sécurité.',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-500',
    },
    {
      icon: Smartphone,
      title: 'Responsive',
      desc: 'Utilisez SmartBay sur mobile, tablette ou ordinateur sans contrainte.',
      color: 'bg-accent/10 text-accent',
    },
  ];

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans">

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        {/* Conteneur centré avec padding horizontal */}
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="SmartBay" className="w-8 h-8 rounded" />
            <span className="font-audiowide font-bold text-accent text-xl">SmartBay</span>
          </div>

          {/* Liens de navigation - cachés sur mobile */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors text-sm">
              Fonctionnalités
            </a>

            <a href="#how" className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors text-sm">
              Comment ça marche
            </a>

            <button
              onClick={onEnterApp}
              className="bg-gradient-to-r from-accent to-accent-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            >
              Accéder à l'app
            </button>
          </div>

          {/* Menu mobile - affiché lorsque menuOpen est true */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen
              ? <X size={22} className="text-gray-600 dark:text-gray-300" />
              : <Menu size={22} className="text-gray-600 dark:text-gray-300" />
            }
          </button>
        </div>

        {/* Menu déroulant mobile */}
        {menuOpen && ( 
            <div className="md:hidden absolute top-16 right-6 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in">
    
        <a
           href="#features"
           onClick={() => setMenuOpen(false)}
           className="block px-5 py-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
           Fonctionnalités
        </a>

        <a
            href="#how"
            onClick={() => setMenuOpen(false)}
            className="block px-5 py-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-t border-gray-100 dark:border-gray-800"
        >
            Comment ça marche
        </a>

        <button
            onClick={() => {
            setMenuOpen(false);
            onEnterApp();
           }}
            className="w-full text-center px-5 py-4 text-sm font-semibold bg-accent text-white hover:bg-accent-dark transition-colors border-t border-gray-100 dark:border-gray-800"
        >
            Accéder à l'app
        </button>

     </div>
      )}
    </nav>

      {/* ===== HERO ===== */}
      <section data-aos="fade-up" className="pt-32 pb-20 px-6 bg-gradient-to-br from-accent/5 via-white to-accent-dark/5 dark:from-accent/10 dark:via-gray-900 dark:to-accent-dark/10">
        <div data-aos="fade-up" className="max-w-4xl mx-auto text-center">
          <div data-aos="fade-up" className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <AlertCircle size={14} />
            Gestion locative simplifiée
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Gérez vos locataires
            <span className="bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
              {' '}en toute simplicité
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            SmartBay vous permet de suivre vos locataires, générer des reçus PDF professionnels
            et recevoir des alertes avant l&#39;expiration des baux.
          </p>

          <div data-aos="fade-up" className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onEnterApp}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-dark text-white px-8 py-4 rounded-2xl text-base font-bold hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-accent/30"
            >
              Commencer gratuitement
              <ChevronRight size={20} />
            </button>
            
              <a href="#features" className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl text-base font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-accent transition-all">
           Voir les fonctionnalités
               </a>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {[
              { value: '100%', label: 'Gratuit' },
              { value: 'PDF', label: 'Reçus pro' },
              { value: '0', label: 'Pub' },
            ].map(stat => (
              <div data-aos="fade-up" key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-accent">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FONCTIONNALITÉS ===== */}
      <section data-aos="fade-up" id="features" className="py-20 px-6 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Une application simple et efficace pour les propriétaires immobiliers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, index) => (
              <div key={title}
                   data-aos="fade-up"
                   data-aos-delay={index * 100}
                   className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMENT ÇA MARCHE ===== */}
      <section data-aos="fade-up" id="how" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Trois étapes simples pour gérer vos locataires.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {steps.map(({ number, title, desc }, index) => (
              <div key={number} 
                   data-aos="fade-up"
                     data-aos-delay={index * 100}
                   className="flex items-start gap-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-dark text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {number}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1">{title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section data-aos="fade-up" className="py-20 px-6 bg-gradient-to-br from-accent to-accent-dark">
        
        <div data-aos="fade-up" className="max-w-2xl mx-auto text-center">
          <img src="/favicon.png" alt="SmartBay" className="w-16 h-16 mx-auto mb-6 rounded-xl" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à simplifier votre gestion ?
          </h2>

          <p className="text-white/80 mb-8 text-lg">
            Rejoignez SmartBay et gérez vos locataires en toute sérénité.
          </p>

          <button
            onClick={onEnterApp}
            data-aos="fade-up"
            className="bg-white text-accent px-8 py-4 rounded-2xl font-bold text-base hover:scale-105 transition-all shadow-lg"
          >
            Accéder à l&#39;application
          </button>

        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src="/favicon.png" alt="SmartBay" className="w-6 h-6 rounded" />
          <span className="font-audiowide text-white font-bold">SmartBay</span>
        </div>
        <p className="text-gray-500 text-sm">&copy; 2026 SmartBay. Tous droits réservés.</p>
      </footer>


      
      {/* ===== SUPPORT FLOATING BUTTON 
    <div className="fixed bottom-6 right-6 z-50">
        
        {supportOpen && (
            <div className="absolute bottom-16 right-0 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm text-center">
                        Me Soutenir ?
                    </h3>
                </div>
                
                <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    
                        <CreditCard size={18} className="text-blue-500" />
                    </div>
                    
                    <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                            Visa / Mastercard
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Paiement international
                        </p>
                    </div>
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-t border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                        
                        <Smartphone size={18} className="text-green-500" />
                    </div>
                    
                    <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                           Mobile Money
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                           MTN / Orange Money
                        </p>
                    </div>
                </button>

            </div>
            )}

            <button
                 onClick={() => setSupportOpen(!supportOpen)}
                 className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
                >
    
                <Heart size={22} fill="currentColor" />
            </button>
        </div> ===== */}

    </div>
  );
}