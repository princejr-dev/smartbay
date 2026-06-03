import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PCHeader from './components/PCHeader';
import PCDashboard from './pages/PCDashboard';
import PCReceipts from './pages/PCReceipts';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import { onAuthChange, logout } from './utils/auth';
import TenantFolder from './pages/TenantFolder';
import TenantFolderDetail from './pages/TenantFolderDetail';
import { loadSettings, saveSettings  } from './utils/storage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import UpdateBanner from './components/UpdateBanner';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const [pcSearchTerm, setPcSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [legalPage, setLegalPage] = useState(null);
  
  // Charge les paramètres initiaux (thème, notifications, rappel)
  const initialSettings = loadSettings();
  const initialTheme = initialSettings.theme || 'light';

  // Thème global de l'app (light/dark)
  const [theme, setTheme] = useState(initialTheme);

  // État utilisateur Firebase
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Page auth active : 'login' ou 'register'
  const [authPage, setAuthPage] = useState('login');

  // Écoute les changements d'état de connexion Firebase
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      // Affiche la landing page si l'utilisateur se déconnecte
      if (!firebaseUser) {
        setShowLanding(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Applique le thème dark/light
  useEffect(() => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [theme]);

  // Reset le scroll en haut à chaque changement de page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activePage]);


  // Sauvegarde le thème
  const handleThemeChange = (newTheme) => {
  setTheme(newTheme);

  const settings = loadSettings();

  saveSettings({
    ...settings,
    theme: newTheme,
  });
};

  // Entrée dans l'app depuis la landing
  const handleEnterApp = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setShowLanding(false);
  };

  // Navigation avec gestion du modal
  const handleNavigate = (page) => {
    if (page === 'add') {
      setActivePage('tenants');
      setModalOpen(true);
    } else {
      setActivePage(page);
      setModalOpen(false);
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    await logout();
    setUser(null);
    setShowLanding(true);
    setActivePage('dashboard');
  };

  // Pages mobile
  const renderMobilePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} user={user} />;
      case 'tenants':
        return (
          <Tenants
            key="tenants"
            onNavigate={handleNavigate}
            modalOpen={modalOpen}
            onModalClose={() => setModalOpen(false)}
            onBack={() => setActivePage('dashboard')}
            user={user}
          />
        );
      case 'notifications':
        return <Notifications onBack={() => setActivePage('dashboard')} user={user} />;
      case 'settings':
        return (
          <Settings
            onBack={() => setActivePage('dashboard')}
            onThemeChange={handleThemeChange}
            onLogout={handleLogout}
            user={user}
          />
        );
      default:
        return <Dashboard onNavigate={handleNavigate} user={user} />;
    }
  };

  // Pages PC
  const renderPCPage = () => {
  // Page détail dossier — prioritaire sur tout
  if (selectedTenant && activePage === 'folders') {
    return (
      <TenantFolderDetail
        tenant={selectedTenant}
        user={user}
        onBack={() => setSelectedTenant(null)}
      />
    );
  }

  switch (activePage) {
    case 'notifications':
      return <Notifications onBack={() => setActivePage('dashboard')} user={user} />;
    case 'settings':
      return (
        <Settings
          onBack={() => setActivePage('dashboard')}
          onThemeChange={handleThemeChange}
          onLogout={handleLogout}
          user={user}
        />
      );
    case 'receipts':
      return <PCReceipts user={user} />;
    case 'folders':
      return (
        <TenantFolder
          user={user}
          onOpenDetail={(tenant) => setSelectedTenant(tenant)}
        />
      );
    default:
      return <PCDashboard searchTerm={pcSearchTerm} activePage={activePage} user={user} />;
  }
};

// Page légale (CGU ou confidentialité)
  if (legalPage === 'privacy') {
    return <PrivacyPolicy onBack={() => setLegalPage(null)} />;
  }
  if (legalPage === 'terms') {
    return <TermsOfService onBack={() => setLegalPage(null)} />;
  }

  // Chargement Firebase en cours
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
        <div className="text-center">
          <img src="/favicon.png" alt="SmartBay" className="w-16 h-16 mx-auto mb-4 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  // Landing page
  if (showLanding) {
    return <Landing onEnterApp={handleEnterApp} onNavigateLegal={setLegalPage} />;
  }

  // Auth — si non connecté
  if (!user) {
    return (
      <div className="min-h-screen">
        {authPage === 'login'
          ? <Login onNavigate={setAuthPage} />
          : <Register onNavigate={setAuthPage} onNavigateLegal={setLegalPage} />
        }
      </div>
    );
  }

  // App principale — connecté
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      {/* Bannière mise à jour */}
      <UpdateBanner />

      {/* ===== VERSION PC ===== */}
      <div className="hidden md:flex">
        <Sidebar activePage={activePage} onNavigate={handleNavigate} onLogout={handleLogout} />
        <div className="flex-1 ml-60 min-h-screen flex flex-col">
          <PCHeader
            onNavigate={handleNavigate}
            theme={theme}
            onThemeChange={handleThemeChange}
            searchTerm={pcSearchTerm}
            onSearch={setPcSearchTerm}
            user={user}
            onLogout={handleLogout}
          />
          <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
            {renderPCPage()}
          </main>
        </div>
      </div>

      {/* ===== VERSION MOBILE ===== */}
      <div className="md:hidden">
        <main className="max-w-2xl mx-auto pb-24">
          {renderMobilePage()}
        </main>
        {activePage !== 'tenants' && activePage !== 'notifications' && activePage !== 'settings' && (
          <Navbar
            activePage={activePage}
            onNavigate={handleNavigate}
            hidden={modalOpen}
            user={user}
          />
        )}
      </div>

    </div>
  );
}