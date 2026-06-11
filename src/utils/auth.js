import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase';

// Inscription email/password
export async function register(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });

  // Envoie email de bienvenue via Vercel API
  try {
    await fetch('/api/send-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userCredential.user.email,
        displayName: name,
      }),
    });
  } catch {
    // Email non bloquant — l'inscription continue même si l'email échoue
    console.log('Email de bienvenue non envoyé');
  }

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
  provider.setCustomParameters({ prompt: 'select_account' });
  const userCredential = await signInWithPopup(auth, provider);

  // Envoie email de bienvenue si c'est la première connexion Google
  if (userCredential._tokenResponse?.isNewUser) {
    try {
      await fetch('/api/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
        }),
      });
    } catch {
      console.log('Email de bienvenue non envoyé');
    }
  }

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

// Réinitialisation mot de passe — Firebase natif (gratuit)
export async function sendPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

// Envoie email de mise à jour à tous les users — appelé manuellement par toi
export async function sendUpdateEmailToAll({ subject, title, body, version, emails }) {
  const res = await fetch('/api/send-update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject,
      title,
      body,
      version,
      emails,
      adminKey: import.meta.env.ADMIN_SECRET_KEY,
    }),
  });
  return res.json();
}