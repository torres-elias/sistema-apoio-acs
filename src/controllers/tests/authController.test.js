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
    vi.resetAllMocks();
  });

  it('login - resolves with user on success', async () => {
    const mockUser = { uid: '123', email: 'a@b.com' };
    authService.login.mockResolvedValue(mockUser);

    const result = await authController.login('a@b.com', 'pass');
    expect(result).toEqual(mockUser);
    expect(authService.login).toHaveBeenCalledWith('a@b.com', 'pass');
  });

  it('login - throws a translated Error on service failure', async () => {
    const err = { code: 'auth/wrong-password', message: 'Bad' };
    authService.login.mockRejectedValue(err);

    await expect(authController.login('a@b.com', 'bad')).rejects.toThrow();
    expect(authService.login).toHaveBeenCalled();
  });

  it('logout - resolves on success', async () => {
    authService.logout.mockResolvedValue();

    await expect(authController.logout()).resolves.toBeUndefined();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('logout - throws a translated Error on service failure', async () => {
    const err = { code: 'auth/error', message: 'Fail' };
    authService.logout.mockRejectedValue(err);

    await expect(authController.logout()).rejects.toThrow();
    expect(authService.logout).toHaveBeenCalled();
  });
});
