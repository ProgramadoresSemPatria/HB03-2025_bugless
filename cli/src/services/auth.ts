import Conf from 'conf';
import { randomUUID } from 'crypto';
import type { User, TokenResponse } from '../types/auth.js';
import { configService } from './config.js';

const WEB_URL = process.env.BUGLESS_WEB_URL || 'http://localhost:3001';

interface AuthStore {
  token?: string;
  user?: User;
}

const store = new Conf<AuthStore>({
  projectName: 'bugless-cli',
  configName: 'auth',
});

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    status: 'pending' | 'completed' | 'expired';
    token?: string;
    user?: User;
  };
}

async function checkLoginStatus(sessionId: string): Promise<TokenResponse | null> {
  const apiUrl = configService.getApiUrl() || 'http://localhost:3000';

  try {
    const response = await fetch(`${apiUrl}/auth/cli-status?sid=${sessionId}`);
    const data = await response.json() as ApiResponse;

    if (!data.success || !data.data) {
      return null;
    }

    if (data.data.status === 'pending') {
      return null;
    }

    if (data.data.status === 'expired') {
      throw new Error('Session expired. Please try again.');
    }

    if (data.data.status === 'completed' && data.data.token && data.data.user) {
      return {
        access_token: data.data.token,
        user: data.data.user,
      };
    }

    return null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('expired')) {
      throw error;
    }
    // Network error - continue polling
    return null;
  }
}

// ============================================
// Auth Flow
// ============================================

export interface LoginCallbacks {
  onOpening: (url: string) => void;
  onPolling: () => void;
  onSuccess: (user: User) => void;
  onError: (error: Error) => void;
}

export async function login(callbacks: LoginCallbacks): Promise<void> {
  try {
    // 1. Generate unique session ID
    const sessionId = randomUUID();
    const loginUrl = `${WEB_URL}/auth/cli?sid=${sessionId}`;

    // 2. Notify caller and open browser
    callbacks.onOpening(loginUrl);
    await openBrowser(loginUrl);

    // 3. Start polling
    callbacks.onPolling();

    while (true) {
      await sleep(2000);

      const result = await checkLoginStatus(sessionId);

      if (result) {
        // Save token and user
        store.set('token', result.access_token);
        store.set('user', result.user);

        callbacks.onSuccess(result.user);
        return;
      }

      // Continue polling...
    }
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error('Login failed'));
  }
}

export function logout(): void {
  store.delete('token');
  store.delete('user');
}

export function getToken(): string | null {
  return (store.get('token') as string) ?? null;
}

export function getUser(): User | null {
  return (store.get('user') as User) ?? null;
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function openBrowser(url: string): Promise<void> {
  try {
    const open = await import('open');
    await open.default(url);
  } catch {
    // Silently fail - user can open URL manually
  }
}

export const authService = {
  login,
  logout,
  getToken,
  getUser,
  isLoggedIn,
};
