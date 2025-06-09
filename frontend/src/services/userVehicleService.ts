import apiService from './api';

export interface UserVehicle {
  id: number;
  user_id: number;
  vehicle_type_id: number;
  license_plate: string;
  model: string;
  year: number;
  capacity_kg: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserVehicleRequest {
  user_id: number;
  vehicle_type_id: number;
  license_plate: string;
  model: string;
  year: number;
  capacity_kg: number;
  is_available?: boolean;
}

export interface UserVehicleSearchParams {
  user_id?: number;
  vehicle_type_id?: number;
  is_available?: boolean;
  page?: number;
  limit?: number;
}

class UserVehicleService {
  async createVehicle(vehicleData: CreateUserVehicleRequest): Promise<UserVehicle> {
    try {
      const response = await apiService.post<UserVehicle>('/user_vehicles', vehicleData);
      return response;
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      throw new Error('Falha ao criar veículo. Tente novamente.');
    }
  }

  async getAllVehicles(params?: UserVehicleSearchParams): Promise<UserVehicle[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/user_vehicles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<UserVehicle[]>(endpoint);
      return response;
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      throw new Error('Falha ao carregar veículos. Tente novamente.');
    }
  }

  async getVehicleById(id: number): Promise<UserVehicle> {
    try {
      const response = await apiService.get<UserVehicle>(`/user_vehicles/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      throw new Error('Falha ao carregar detalhes do veículo.');
    }
  }

  async getVehiclesByUserId(userId: number): Promise<UserVehicle[]> {
    try {
      const response = await apiService.get<UserVehicle[]>(`/user_vehicles/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar veículos do usuário:', error);
      throw new Error('Falha ao carregar veículos do usuário.');
    }
  }

  async updateVehicle(id: number, vehicleData: Partial<CreateUserVehicleRequest>): Promise<UserVehicle> {
    try {
      const response = await apiService.put<UserVehicle>(`/user_vehicles/${id}`, vehicleData);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw new Error('Falha ao atualizar veículo. Tente novamente.');
    }
  }

  async deleteVehicle(id: number): Promise<void> {
    try {
      await apiService.delete(`/user_vehicles/${id}`);
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      throw new Error('Falha ao deletar veículo. Tente novamente.');
    }
  }

  async toggleAvailability(id: number, isAvailable: boolean): Promise<UserVehicle> {
    try {
      const response = await apiService.put<UserVehicle>(`/user_vehicles/${id}`, { is_available: isAvailable });
      return response;
    } catch (error) {
      console.error('Erro ao alterar disponibilidade do veículo:', error);
      throw new Error('Falha ao alterar disponibilidade do veículo.');
    }
  }
}

export const userVehicleService = new UserVehicleService();
export default userVehicleService;
