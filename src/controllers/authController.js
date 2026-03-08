import { login as serviceLogin, logout as serviceLogout } from "../services/authService";
import { translateError } from "../utils/errorTranslator";

/**
 * login
 * - Orquestra a chamada ao `authService.login`.
 * - Traduz erros por meio de `translateError` e lança um `Error` com mensagem amigável.
 * - Retorna o `user` retornado pelo serviço em caso de sucesso.
 */
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

/**
 * logout
 * - Chama `authService.logout` e propaga erros traduzidos.
 * - Não manipula o estado da UI; cabe ao consumidor lidar com a promessa rejeitada.
 */
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
