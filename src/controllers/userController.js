import * as userService from '../services/userService';
import { translateError } from '../utils/errorTranslator';

export const handleAddUser = async (formData) => {
  const { nome, email, password, confirmPassword, cargo, unidadeId } = formData;

  if (!nome || !email || !password || !cargo) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  if (password !== confirmPassword) {
    throw new Error("As senhas não coincidem.");
  }

  if (password.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }

  if (!unidadeId) {
    throw new Error("Selecione uma unidade de saúde.");
  }

  try {
    await userService.registerNewUser(email.trim().toLowerCase(), password, nome, cargo, unidadeId);
    return `Usuário ${nome} (${cargo}) cadastrado com sucesso.`;
  } catch (error) {
    console.error(error);
    throw new Error(translateError(error.code) || "Erro ao criar conta.");
  }
};
