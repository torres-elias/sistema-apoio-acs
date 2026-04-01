import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../config/firebase';
import * as authController from '../controllers/authController';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); 
  const [initializing, setInitializing] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const userDoc = await getDoc(doc(db, "users", u.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data()); 
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  async function signIn(email, password) {
    return authController.login(email, password);
  }

  async function signOut() {
    return authController.logout();
  }

  return (
    <AuthContext.Provider value={{ user, profile, initializing, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}