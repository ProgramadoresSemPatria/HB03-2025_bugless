import Conf from 'conf';
import { randomUUID } from 'crypto';
import type { User, TokenResponse } from '../types/auth.js';

const WEB_URL = process.env.BUGLESS_WEB_URL || 'http://localhost:3000';

interface AuthStore {
  token?: string;
  user?: User;
  mock_attempts?: number;
}

const store = new Conf<AuthStore>({
  projectName: 'bugless-cli',
  configName: 'auth',
});

// ============================================
// MOCK - Replace when API is ready
// ============================================

async function checkLoginStatus(sessionId: string): Promise<TokenResponse | null> {
  // TODO: When API is ready:
  // const res = await fetch(`${API_URL}/api/auth/cli-status?sid=${sessionId}`);
  // const data = await res.json();
  // if (data.status === 'pending') return null;
  // return data;

  // MOCK: Simulates pending for 3 attempts, then returns token
  const attempts = (store.get('mock_attempts') ?? 0) as number;
  store.set('mock_attempts', attempts + 1);

  if (attempts < 3) {
    return null; // Simulates "pending"
  }

  store.set('mock_attempts', 0); // Reset
  return {
    access_token: 'bg_mock_token_xxxxx',
    user: {
      email: 'mario@email.com',
      name: 'Mario',
    },
  };
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
  store.delete('mock_attempts');
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
