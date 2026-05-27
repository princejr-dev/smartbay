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
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Ajoute un nouveau locataire
export async function addTenant(userId, tenantData) {
  const docRef = await addDoc(collection(db, 'tenants'), {
    ...tenantData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...tenantData, userId };
}

// Met à jour un locataire existant
export async function updateTenant(tenantId, tenantData) {
  const ref = doc(db, 'tenants', tenantId);
  await updateDoc(ref, {
    ...tenantData,
    updatedAt: serverTimestamp(),
  });
}

// Supprime un locataire
export async function deleteTenant(tenantId) {
  await deleteDoc(doc(db, 'tenants', tenantId));
}