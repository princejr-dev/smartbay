import { useEffect, useState, lazy, Suspense } from 'react';
import { logout, onAuthChange } from './utils/auth';
import { loadSettings, saveSettings } from './utils/storage';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Tenants from './pages/Tenants';
import PCDashboard from './pages/PCDashboard';

// Pages mobiles où la navbar du bas gênerait l'expérience.
const MOBILE_PAGES_WITHOUT_NAVBAR = ['tenants', 'notifications', 'settings'];

// Initialisation paresseuse: loadSettings() n'est appelé qu'au premier rendu.
const getInitialTheme = () => {
  const settings = loadSettings();
  return settings.theme || 'light';
};

// Fallback de chargement
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
    </div>
  );
}

// Pages chargées à la demande (lourdes)
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const PCReceipts = lazy(() => import('./pages/PCReceipts'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Register = lazy(() => import('./pages/Register'));
const TenantFolder = lazy(() => import('./pages/TenantFolder'));
const TenantFolderDetail = lazy(() => import('./pages/TenantFolderDetail'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// Composants toujours chargés (petits)
import Navbar from './components/Navbar';
import PCHeader from './components/PCHeader';
import Sidebar from './components/Sidebar';
import UpdateBanner from './components/UpdateBanner';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [authLoading, setAuthLoading] = useState(true);
  const [authPage, setAuthPage] = useState('login');
  const [legalPage, setLegalPage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pcSearchTerm, setPcSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showLanding, setShowLanding] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [user, setUser] = useState(null);

  // Firebase garde l'utilisateur en mémoire et prévient l'app à chaque changement.
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);

      if (!firebaseUser) {
        setShowLanding(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Tailwind utilise la classe "dark" sur <html> pour activer le thème sombre.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Chaque changement de page repart en haut pour éviter une position de scroll héritée.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activePage]);

  const goToDashboard = () => {
    setActivePage('dashboard');
  };

  const handleThemeChange = (newTheme) => {
    const settings = loadSettings();

    setTheme(newTheme);
    saveSettings({
      ...settings,
      theme: newTheme,
    });
  };

  const handleEnterApp = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setShowLanding(false);
  };

  // "add" est une action spéciale: on ouvre la page locataires avec le modal actif.
  const handleNavigate = (page) => {
    if (page === 'add') {
      setActivePage('tenants');
      setModalOpen(true);
      return;
    }

    setActivePage(page);
    setModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setShowLanding(true);
    setActivePage('dashboard');
    setSelectedTenant(null);
  };

  // Rendu dédié au mobile: certaines pages ont un comportement différent de la version PC.
  const renderMobilePage = () => {
    switch (activePage) {
      case 'tenants':
        return (
          <Tenants
            key="tenants"
            modalOpen={modalOpen}
            onBack={goToDashboard}
            onModalClose={() => setModalOpen(false)}
            onNavigate={handleNavigate}
            user={user}
          />
        );
      case 'notifications':
        return <Notifications onBack={goToDashboard} user={user} />;
      case 'settings':
        return (
          <Settings
            onBack={goToDashboard}
            onLogout={handleLogout}
            onThemeChange={handleThemeChange}
            user={user}
          />
        );
      case 'dashboard':
      default:
        return <Dashboard onNavigate={handleNavigate} user={user} />;
    }
  };

  // Rendu dédié au PC: la page détail d'un dossier est prioritaire sur la liste.
  const renderPCPage = () => {
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
        return <Notifications onBack={goToDashboard} user={user} />;
      case 'settings':
        return (
          <Settings
            onBack={goToDashboard}
            onLogout={handleLogout}
            onThemeChange={handleThemeChange}
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
        return <PCDashboard activePage={activePage} searchTerm={pcSearchTerm} user={user} />;
    }
  };

  // Les pages légales passent avant l'auth et l'app principale.
  if (legalPage === 'privacy') {
    return <PrivacyPolicy onBack={() => setLegalPage(null)} />;
  }

  if (legalPage === 'terms') {
    return <TermsOfService onBack={() => setLegalPage(null)} />;
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-accent to-accent-dark">
        <div className="text-center">
          <img
            src="/favicon.webp"
            alt="SmartBay"
            className="mx-auto mb-4 h-16 w-16 animate-pulse rounded"
          />
        </div>
      </div>
    );
  }

  if (showLanding) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Landing 
          onEnterApp={handleEnterApp} 
          onNavigateLegal={setLegalPage} />
      </Suspense>
    );
  }

  if (!user) {
    return (
      <Suspense fallback={<PageLoader />}>
      <div className="min-h-screen">
        {authPage === 'login' ? (
          <Login onNavigate={setAuthPage} />
        ) : (
          <Register onNavigate={setAuthPage} onNavigateLegal={setLegalPage} />
        )}
      </div>
      </Suspense>
    );
  }

  const showMobileNavbar = !MOBILE_PAGES_WITHOUT_NAVBAR.includes(activePage);

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="min-h-screen bg-gray-100 transition-colors duration-300 dark:bg-gray-900">
        <UpdateBanner />

      <div className="hidden md:flex">
        <Sidebar activePage={activePage} onLogout={handleLogout} onNavigate={handleNavigate} />

        <div className="ml-60 flex min-h-screen flex-1 flex-col">
          <PCHeader
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            onSearch={setPcSearchTerm}
            onThemeChange={handleThemeChange}
            searchTerm={pcSearchTerm}
            theme={theme}
            user={user}
          />

          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            <Suspense fallback={<PageLoader />}>
              {renderPCPage()}
            </Suspense>
          </main>
        </div>
      </div>

      <div className="md:hidden">
        <main className="mx-auto max-w-2xl pb-24">
          <Suspense fallback={<PageLoader />}>
            {renderMobilePage()}
          </Suspense>
        </main>

        {showMobileNavbar && (
          <Navbar
            activePage={activePage}
            hidden={modalOpen}
            onNavigate={handleNavigate}
            user={user}
          />
        )}
      </div>
    </div>
    </Suspense>
  );
}
