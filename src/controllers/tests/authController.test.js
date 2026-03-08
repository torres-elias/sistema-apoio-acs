import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the services used by the controller. The path is relative to this test file.
vi.mock('../../services/authService', () => ({
  login: vi.fn(),
  logout: vi.fn(),
}));

import * as authController from '../authController';
import * as authService from '../../services/authService';

describe('authController', () => {
  beforeEach(() => {
    // Reset mocks between tests to avoid cross-test interference
    vi.resetAllMocks();
  });

  it('login - resolves with user on success', async () => {
    // Caso de sucesso: quando o serviço retorna um usuário válido,
    // o controller deve retornar esse usuário inalterado.
    const mockUser = { uid: '123', email: 'a@b.com' };
    authService.login.mockResolvedValue(mockUser);

    const result = await authController.login('a@b.com', 'pass');
    expect(result).toEqual(mockUser);
    expect(authService.login).toHaveBeenCalledWith('a@b.com', 'pass');
  });

  it('login - throws a translated Error on service failure', async () => {
    // Caso de falha: quando o serviço rejeita, o controller deve
    // propagar um erro (já traduzido pelo controller).
    const err = { code: 'auth/wrong-password', message: 'Bad' };
    authService.login.mockRejectedValue(err);

    await expect(authController.login('a@b.com', 'bad')).rejects.toThrow();
    expect(authService.login).toHaveBeenCalled();
  });

  it('logout - resolves on success', async () => {
    // Logout com sucesso: o controller deve resolver sem valor.
    authService.logout.mockResolvedValue();

    await expect(authController.logout()).resolves.toBeUndefined();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('logout - throws a translated Error on service failure', async () => {
    // Logout com falha: o controller deve propagar um erro traduzido.
    const err = { code: 'auth/error', message: 'Fail' };
    authService.logout.mockRejectedValue(err);

    await expect(authController.logout()).rejects.toThrow();
    expect(authService.logout).toHaveBeenCalled();
  });
});
