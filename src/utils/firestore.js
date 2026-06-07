import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// ===== CACHE EN MÉMOIRE =====
// Évite les requêtes Firestore répétées inutilement
const cache = new Map();
const CACHE_DURATION = 30000; // 30 secondes

// Invalide le cache d'un utilisateur après modification
export function invalidateCache(userId) {
  cache.delete(`tenants_${userId}`);
}

// ===== LOCATAIRES =====

// Charge tous les locataires d'un utilisateur
export async function fetchTenants(userId) {
  const cacheKey = `tenants_${userId}`;
  const cached = cache.get(cacheKey);

  // Retourne le cache si encore valide
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const q = query(
    collection(db, 'tenants'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({
    // L'id Firestore du document (toujours une string)
    id: doc.id,
    ...doc.data(),
  }));

  // Sauvegarde en cache
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

// Ajoute un nouveau locataire
export async function addTenant(userId, tenantData) {
  const docRef = await addDoc(collection(db, 'tenants'), {
    ...tenantData,
    userId,
    // Premier contrat — reçu N°001
    receiptCount: tenantData.receiptCount || 1,
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Invalide le cache pour forcer le rechargement
  invalidateCache(userId);

  return { id: docRef.id, ...tenantData, userId, receiptCount: tenantData.receiptCount || 1 };
}

// Met à jour un locataire existant
export async function updateTenant(tenantId, tenantData) {
  const ref = doc(db, 'tenants', tenantId);
  await updateDoc(ref, {
    ...tenantData,
    updatedAt: serverTimestamp(),
  });

  // Invalide le cache si userId disponible
  if (tenantData.userId) invalidateCache(tenantData.userId);
}

// Supprime un locataire
export async function deleteTenant(tenantId) {
  await deleteDoc(doc(db, 'tenants', tenantId));
}

// Archive un locataire (status = 'archived')
export async function archiveTenant(tenantId) {
  const ref = doc(db, 'tenants', tenantId);
  await updateDoc(ref, {
    status: 'archived',
    updatedAt: serverTimestamp(),
  });
}

// ===== PAIEMENTS =====

// Charge tous les paiements d'un locataire
export async function fetchPayments(tenantId) {
  const q = query(
    collection(db, 'payments'),
    where('tenantId', '==', tenantId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Ajoute un paiement pour un locataire
export async function addPayment(userId, tenantId, paymentData) {
  const docRef = await addDoc(collection(db, 'payments'), {
    ...paymentData,
    tenantId,
    userId,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...paymentData, tenantId, userId };
}

// Supprime un paiement
export async function deletePayment(paymentId) {
  await deleteDoc(doc(db, 'payments', paymentId));
}

// ===== NOTES =====

// Charge toutes les notes d'un locataire
export async function fetchNotes(tenantId) {
  const q = query(
    collection(db, 'notes'),
    where('tenantId', '==', tenantId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Ajoute une note pour un locataire
export async function addNote(userId, tenantId, content) {
  const docRef = await addDoc(collection(db, 'notes'), {
    content,
    tenantId,
    userId,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, content, tenantId, userId };
}

// Supprime une note
export async function deleteNote(noteId) {
  await deleteDoc(doc(db, 'notes', noteId));
}

// ===== NETTOYAGE =====

// Supprime tous les locataires d'un utilisateur
export async function clearAllTenants(userId) {
  const q = query(
    collection(db, 'tenants'),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  const deletions = snapshot.docs.map(document =>
    deleteDoc(doc(db, 'tenants', document.id))
  );
  await Promise.all(deletions);

  // Invalide le cache après nettoyage
  invalidateCache(userId);
}