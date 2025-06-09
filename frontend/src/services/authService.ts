import apiService from './api';

export interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  profile_picture_url?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);

    if (response.token) {
      apiService.setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);

    if (response.token) {
      apiService.setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  logout() {
    apiService.removeToken();
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  isShipper(): boolean {
    return this.hasRole('shipper');
  }

  isCarrier(): boolean {
    return this.hasRole('carrier');
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }
}

export const authService = new AuthService();
export default authService;
