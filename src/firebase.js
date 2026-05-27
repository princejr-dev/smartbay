// Import des fonctions Firebase nécessaires
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase de SmartBay
const firebaseConfig = {
  apiKey: "AIzaSyCAwbNxkUhHHJfUklb-nqX4KpU-nWDBcBY",
  authDomain: "smartbay-app.firebaseapp.com",
  projectId: "smartbay-app",
  storageBucket: "smartbay-app.firebasestorage.app",
  messagingSenderId: "791541884041",
  appId: "1:791541884041:web:505e9bcc35c981b82c1258"
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Exporte Auth et Firestore pour utilisation dans l'app
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;