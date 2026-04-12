import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, firebaseConfig } from '../config/firebase';

export const registerNewUser = async (email, password, nome, cargo, unidadeId) => {
  const appName = "SecondaryApp";

  const secondaryApp = getApps().find(a => a.name === appName)
    || initializeApp(firebaseConfig, appName);

  const secondaryAuth = getAuth(secondaryApp);

  try {
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      nome,
      email,
      cargo,
      unidadeId: unidadeId || null,
      createdAt: new Date()
    });

    await signOut(secondaryAuth);

    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (uid) => {
  const docSnap = await getDoc(doc(db, "users", uid));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};
