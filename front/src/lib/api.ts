const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[] | undefined>
}

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown>
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { body, ...restOptions } = options

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...restOptions.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json()
    return data as ApiResponse<T>
  } catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      message: 'Network error. Please try again.',
    }
  }
}

// Auth API
interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface CliLoginResponse {
  message: string
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: (name: string, email: string, password: string) =>
    apiClient<LoginResponse>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),

  cliLogin: (email: string, password: string, sessionId: string) =>
    apiClient<CliLoginResponse>('/auth/cli-login', {
      method: 'POST',
      body: { email, password, sessionId },
    }),
}
