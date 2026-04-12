import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

async function createFamily(data, uid){
    await addDoc(collection(db, 'families'), {
        ...data,
        acsUid: uid,
        createdAt: serverTimestamp()
    });
}

async function getFamilies(uid) {
    const q = query(collection(db, 'families'), where('acsUid', '==', uid));
    const snapshot = await getDocs(q)
    const families = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return families;
}

async function updateFamily(id, data) {
    await updateDoc(doc(db, 'families', id), data)
}

async function deleteFamily(id){
    await deleteDoc(doc(db, 'families', id));
}

export {createFamily, getFamilies, updateFamily, deleteFamily}
