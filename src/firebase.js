// Import des fonctions Firebase nécessaires
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase de SmartBay
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUT_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_API_ID
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Exporte Auth et Firestore pour utilisation dans l'app
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;