import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../config/firebase';

export const registerNewUser = async (email, password, nome, cargo) => {
  // Cria ou recupera a instância secundária
  const appName = "SecondaryApp";
  const secondaryApp = getApps().find(a => a.name === appName) 
    || initializeApp(firebaseConfig, appName);
  
  const secondaryAuth = getAuth(secondaryApp);
  const db = getFirestore();

  try {
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = userCredential.user.uid;

    // Salva no Firestore usando os mesmos nomes que vi no seu print
    await setDoc(doc(db, "users", uid), {
      nome: nome,
      email: email,
      cargo: cargo,
      createdAt: new Date()
    });

    await signOut(secondaryAuth);
    return { success: true };
  } catch (error) {
    throw error;
  }
};