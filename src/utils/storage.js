// Clés de stockage dans localStorage
const KEYS = {
  SETTINGS: 'smartbay_settings',
};

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
  localStorage.setItem(
    KEYS.SETTINGS, 
    JSON.stringify(settings));
}

// Supprime les paramètres
export function clearSettings() {
  localStorage.removeItem(KEYS.SETTINGS);
}