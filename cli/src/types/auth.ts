export interface User {
  id: string;
  email: string;
  name: string;
}

export interface TokenResponse {
  access_token: string;
  user: User;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
