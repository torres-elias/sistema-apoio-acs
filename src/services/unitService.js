import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

async function createUnit(data) {
  const docRef = await addDoc(collection(db, 'units'), {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

async function getUnits() {
  const snapshot = await getDocs(collection(db, 'units'));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function deleteUnit(id) {
  await deleteDoc(doc(db, 'units', id));
}

export { createUnit, getUnits, deleteUnit };
