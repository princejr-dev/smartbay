// Clés de stockage dans localStorage
const KEYS = {
  TENANTS: 'smartbay_tenants',
  SETTINGS: 'smartbay_settings',
};

// --- Locataires ---

// Charge tous les locataires depuis localStorage
export function loadTenants() {
  const data = localStorage.getItem(KEYS.TENANTS);
  return data ? JSON.parse(data) : [];
}

// Sauvegarde tous les locataires dans localStorage
export function saveTenants(tenants) {
  localStorage.setItem(KEYS.TENANTS, JSON.stringify(tenants));
}

// --- Paramètres ---

// Charge les paramètres (thème, notifications, rappel)
export function loadSettings() {
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : {
    theme: 'light',
    notifications: true,
    reminderDays: 1,
  };
}

// Sauvegarde les paramètres
export function saveSettings(settings) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

// Supprime toutes les données
export function clearAll() {
  localStorage.removeItem(KEYS.TENANTS);
  localStorage.removeItem(KEYS.SETTINGS);
}