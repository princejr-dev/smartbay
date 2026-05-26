import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PCHeader from './components/PCHeader';
import PCDashboard from './pages/PCDashboard';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import { loadSettings, saveSettings } from './utils/storage';

// Initialise le thème avant le premier rendu
const initialSettings = loadSettings();
const initialTheme = initialSettings.theme || 'light';
if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark');
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [theme, setTheme] = useState(initialTheme);
  const [modalOpen, setModalOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [pcSearchTerm, setPcSearchTerm] = useState('');

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

  // Gestion du thème avec sauvegarde
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    const settings = loadSettings();
    saveSettings({ ...settings, theme: newTheme });
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

  // Pages mobile
  const renderMobilePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'tenants':
        return (
          <Tenants
            key="tenants"
            onNavigate={handleNavigate}
            modalOpen={modalOpen}
            onModalClose={() => setModalOpen(false)}
            onBack={() => setActivePage('dashboard')}
          />
        );
      case 'notifications':
        return <Notifications onBack={() => setActivePage('dashboard')} />;
      case 'settings':
        return <Settings onBack={() => setActivePage('dashboard')} onThemeChange={handleThemeChange} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  // Pages PC
  const renderPCPage = () => {
    switch (activePage) {
      case 'notifications':
        return <Notifications onBack={() => setActivePage('dashboard')} />;
      case 'settings':
        return <Settings onBack={() => setActivePage('dashboard')} onThemeChange={handleThemeChange} />;
      default:
        return <PCDashboard searchTerm={pcSearchTerm} activePage={activePage} />;
    }
  };

  // Landing page
  if (showLanding) {
    return <Landing onEnterApp={handleEnterApp} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      {/* ===== VERSION PC (md et plus) ===== */}
      <div className="hidden md:flex">
        <Sidebar activePage={activePage} onNavigate={handleNavigate} />
        <div className="flex-1 ml-60 min-h-screen flex flex-col">
          <PCHeader
            onNavigate={handleNavigate}
            theme={theme}
            onThemeChange={handleThemeChange}
            searchTerm={pcSearchTerm}
            onSearch={setPcSearchTerm}
          />
          <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
            {renderPCPage()}
          </main>
        </div>
      </div>

      {/* ===== VERSION MOBILE (moins de md) ===== */}
      <div className="md:hidden">
        <main className="max-w-2xl mx-auto pb-24">
          {renderMobilePage()}
        </main>

        {/* Navbar mobile */}
        {activePage !== 'tenants' && activePage !== 'notifications' && activePage !== 'settings' && (
          <Navbar
            activePage={activePage}
            onNavigate={handleNavigate}
            hidden={modalOpen}
          />
        )}
      </div>

    </div>
  );
}