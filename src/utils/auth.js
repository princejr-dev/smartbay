import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase';

// Inscription email/password
export async function register(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  return userCredential.user;
}

// Connexion email/password
export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Connexion Google
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  // Force la sélection du compte à chaque fois
  provider.setCustomParameters({ prompt: 'select_account' });
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
}

// Déconnexion
export async function logout() {
  await signOut(auth);
}

// Écoute les changements d'état
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}