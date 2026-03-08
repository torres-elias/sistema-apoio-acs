import { login as serviceLogin, logout as serviceLogout } from "../services/authService";
import { translateError } from "../utils/errorTranslator";

async function login(email, password) {
  try {
    const user = await serviceLogin(email, password);
    return user;
  } catch (error) {
    const message = translateError(error.code) || error.message || 'Erro ao fazer login';
    const err = new Error(message);
    err.code = error.code;
    throw err;
  }
}

async function logout() {
  try {
    await serviceLogout();
  } catch (error) {
    const message = translateError(error.code) || error.message || 'Erro ao deslogar';
    const err = new Error(message);
    err.code = error.code;
    throw err;
  }
}

export { login, logout };
