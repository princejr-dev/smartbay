import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import { loadSettings } from './utils/storage';

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

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={setActivePage} />;
      case 'tenants': return <Tenants key="tenants" onNavigate={setActivePage} modalOpen={modalOpen} onModalClose={() => setModalOpen(false)} />;
      case 'notifications': return <Notifications onBack={() => setActivePage('dashboard')} />;
      case 'settings': return <Settings onBack={() => setActivePage('dashboard')} onThemeChange={setTheme} />;
      default: return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <main className="max-w-2xl mx-auto pb-24">
        {renderPage()}
      </main>
      {activePage !== 'notifications' && activePage !== 'settings' && (
        <Navbar
          activePage={activePage}
          onNavigate={(page) => {
            if (page === 'add') {
              // Navigue vers tenants et ouvre le modal
              setActivePage('tenants');
              setModalOpen(true);
            } else {
              setActivePage(page);
              setModalOpen(false);
            }
          }}
          hidden={modalOpen}
        />
      )}
    </div>
  );
}