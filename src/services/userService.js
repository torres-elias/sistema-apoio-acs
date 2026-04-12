// src/services/userService.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
// Importamos o db (principal) e o firebaseConfig (para a instância secundária)
import { db, firebaseConfig } from '../config/firebase';

export const registerNewUser = async (email, password, nome, cargo) => {
  const appName = "SecondaryApp";

  // Agora firebaseConfig não será mais undefined
  const secondaryApp = getApps().find(a => a.name === appName)
    || initializeApp(firebaseConfig, appName);

  const secondaryAuth = getAuth(secondaryApp);

  try {
    // 1. Cria o usuário no Auth (usando a instância secundária para não deslogar o ADM)
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = userCredential.user.uid;

    // 2. Salva os dados no Firestore usando o 'db' principal do ADM
    await setDoc(doc(db, "users", uid), {
      nome: nome,
      email: email,
      cargo: cargo,
      createdAt: new Date()
    });

    // 3. Limpa a sessão secundária imediatamente
    await signOut(secondaryAuth);

    return { success: true };
  } catch (error) {
    // Se o erro for 'auth/email-already-in-use', você saberá que o usuário já existe
    throw error;
  }
};
