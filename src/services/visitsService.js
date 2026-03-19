import {
  collection, addDoc, getDocs, updateDoc,
  deleteDoc, doc, query, where, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * FIRESTORE COLLECTION: 'visits'
 * 
 * Estrutura de um documento:
 * {
 *   familyId:       string,   // ID da família visitada
 *   acsUid:         string,   // UID do agente de saúde
 *   paciente:       string,   // Nome do membro visitado (ou "Família")
 *   tipoVisita:     string,   // 'Rotina' | 'Busca Ativa' | 'Urgência'
 *   motivo:         string,   // Motivo da visita
 *   pressao:        string,   // Pressão arterial (opcional)
 *   glicemia:       string,   // Glicemia (opcional)
 *   observacoes:    string,   // Observações livres
 *   dataVisita:     string,   // Data formatada DD/MM/AAAA
 *   createdAt:      Timestamp // Gerado pelo servidor
 * }
 */

async function createVisit(data, acsUid) {
  const docRef = await addDoc(collection(db, 'visits'), {
    ...data,
    acsUid,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

async function getVisitsByFamily(familyId) {
  const q = query(
    collection(db, 'visits'),
    where('familyId', '==', familyId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getVisitsByAcs(acsUid) {
  const q = query(
    collection(db, 'visits'),
    where('acsUid', '==', acsUid)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function updateVisit(id, data) {
  await updateDoc(doc(db, 'visits', id), data);
}

async function deleteVisit(id) {
  await deleteDoc(doc(db, 'visits', id));
}

export { createVisit, getVisitsByFamily, getVisitsByAcs, updateVisit, deleteVisit };