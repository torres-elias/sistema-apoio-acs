import * as userService from '../services/userService';
import { translateError } from '../utils/errorTranslator';

export const handleAddUser = async (formData) => {
  const { nome, email, password, confirmPassword, cargo } = formData;

  if (!nome || !email || !password || !cargo) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  if (password !== confirmPassword) {
    throw new Error("As senhas não coincidem.");
  }

  if (password.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }

  try {
    await userService.registerNewUser(email.trim().toLowerCase(), password, nome, cargo);
    return "Usuário cadastrado com sucesso!";
  } catch (error) {
    console.error(error);
    throw new Error(translateError(error.code) || "Erro ao criar conta.");
  }
};