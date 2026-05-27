import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';

// Inscription avec email/password + nom
export async function register(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Ajoute le nom au profil Firebase
  await updateProfile(userCredential.user, { displayName: name });
  return userCredential.user;
}

// Connexion avec email/password
export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Déconnexion
export async function logout() {
  await signOut(auth);
}

// Écoute les changements d'état de connexion
// Retourne une fonction pour se désabonner
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}