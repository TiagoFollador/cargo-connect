import apiService from './api';

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  profile_picture_url?: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role_id: number;
  profile_picture_url?: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  phone?: string;
  profile_picture_url?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UserSearchParams {
  email?: string;
  name?: string;
  role_id?: number;
  page?: number;
  limit?: number;
}

class UserService {
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await apiService.post<User>('/users', userData);
      return response;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error('Falha ao criar usuário. Tente novamente.');
    }
  }

  async getAllUsers(params?: UserSearchParams): Promise<User[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<User[]>(endpoint);
      return response;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw new Error('Falha ao carregar usuários. Tente novamente.');
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await apiService.get<User>(`/users/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw new Error('Falha ao carregar detalhes do usuário.');
    }
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiService.put<User>(`/users/${id}`, userData);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error('Falha ao atualizar usuário. Tente novamente.');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await apiService.delete(`/users/${id}`);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new Error('Falha ao deletar usuário. Tente novamente.');
    }
  }

  async changePassword(id: number, passwordData: ChangePasswordRequest): Promise<void> {
    try {
      await apiService.put(`/users/${id}/password`, passwordData);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw new Error('Falha ao alterar senha. Tente novamente.');
    }
  }

  async uploadAvatar(id: number, file: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${apiService['baseURL']}/users/${id}/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha no upload da imagem');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      throw new Error('Falha ao fazer upload da imagem. Tente novamente.');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>('/users/me');
      return response;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      throw new Error('Falha ao carregar dados do usuário.');
    }
  }

  async updateCurrentUser(userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiService.put<User>('/users/me', userData);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw new Error('Falha ao atualizar perfil. Tente novamente.');
    }
  }
}

export const userService = new UserService();
export default userService;
