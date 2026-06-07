import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function UpdateBanner() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [version, setVersion] = useState('');

  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Charge le fichier version.json depuis le serveur
        const res = await fetch('/version.json?t=' + Date.now());
        const data = await res.json();

        // Compare avec la version vue par l'utilisateur
        const seenVersion = localStorage.getItem('smartbay_seen_version');

        if (seenVersion !== data.version) {
          setMessage(data.message);
          setVersion(data.version);
          setShow(true);
        }
      } catch {
        console.log('Pas de mise à jour disponible');
      }
    };
    checkVersion();
  }, []);

  const handleClose = () => {
    // Marque cette version comme vue
    localStorage.setItem('smartbay_seen_version', version);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:top-20 md:left-auto md:right-6 md:w-96 z-50 animate-slide-in">
      
      <div className="bg-gradient-to-r from-accent to-accent-dark rounded-2xl p-4 shadow-xl shadow-accent/30">
        
        <div className="flex items-start gap-3">
          
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          
          <div className="flex-1">
            <p className="text-white font-bold text-sm mb-0.5">
              SmartBay v{version} — Nouvelle mise à jour disponible !
            </p>
            <p className="text-white/80 text-xs leading-relaxed">{message}</p>
          </div>
          
          <button
            onClick={handleClose}
            className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
       
        <button
          onClick={handleClose}
          className="w-full mt-3 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-xs font-semibold transition-colors"
        >
          Super, merci !
        </button>
      </div>
    </div>
  );
}