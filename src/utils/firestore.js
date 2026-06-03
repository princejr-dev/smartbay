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

// ===== LOCATAIRES =====

// Charge tous les locataires d'un utilisateur
export async function fetchTenants(userId) {
  const q = query(
    collection(db, 'tenants'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    // L'id Firestore du document (toujours une string)
    id: doc.id,
    // Les données du document (on exclut l'ancien champ id s'il existe)
    ...doc.data(),
    // On force l'id à être celui du document Firestore
  }));
}

// Ajoute un nouveau locataire
export async function addTenant(userId, tenantData) {
  const docRef = await addDoc(collection(db, 'tenants'), {
    ...tenantData,
    userId,
    // Premier contrat — reçu N°001
    receiptCount: 1,
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...tenantData, userId, receiptCount: 1 };
}

// updateTenant — garde juste (tenantId, data), pas de userId
export async function updateTenant(tenantId, tenantData) {
  const ref = doc(db, 'tenants', tenantId);
  await updateDoc(ref, {
    ...tenantData,
    updatedAt: serverTimestamp(),
  });
}

// deleteTenant — garde juste (tenantId), pas de userId
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

// Supprime tous les locataires d'un utilisateur (fonction de nettoyage)
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
}