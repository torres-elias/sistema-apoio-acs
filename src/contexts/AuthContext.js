import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import * as authController from '../controllers/authController';

// Contexto de autenticação: fornece 'user', 'initializing' e ações 'signIn'/'signOut'.
// Use 'useAuth()' para acessar o estado e as ações em qualquer componente.
const AuthContext = createContext(null);

/**
 * AuthProvider
 * - Observa o estado de autenticação do Firebase ('onAuthStateChanged').
 * - Mantém 'user' e 'initializing' no estado.
 * - Expõe 'signIn(email, password)' e 'signOut()' que delegam ao 'authController'.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Subscrição ao auth do Firebase para atualizar o usuário autenticado.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  /**
   * signIn
   * - Faz login via 'authController.login'.
   * - Não altera o estado 'user' diretamente; o listener do Firebase atualiza o estado.
   */
  async function signIn(email, password) {
    return authController.login(email, password);
  }

  /**
   * signOut
   * - Desloga o usuário via 'authController.logout'.
   * - O listener do Firebase limpará 'user' automaticamente.
   */
  async function signOut() {
    return authController.logout();
  }

  return (
    <AuthContext.Provider value={{ user, initializing, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth
 * - Hook para consumir o 'AuthContext'.
 * - Retorna '{ user, initializing, signIn, signOut }'.
 */
export function useAuth() {
  return useContext(AuthContext);
}
