import apiService from './api';

export interface CargoType {
  id: number;
  name: string;
  description?: string;
  requires_special_handling?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleType {
  id: number;
  name: string;
  description?: string;
  capacity_kg?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

class UtilsService {
  async getCargoTypes(): Promise<CargoType[]> {
    try {
      const response = await apiService.get<CargoType[]>('/cargo_types');
      return response;
    } catch (error) {
      console.error('Erro ao carregar tipos de carga:', error);
      throw new Error('Falha ao carregar tipos de carga.');
    }
  }

  async getCargoTypeById(id: number): Promise<CargoType> {
    try {
      const response = await apiService.get<CargoType>(`/cargo_types/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao carregar tipo de carga:', error);
      throw new Error('Falha ao carregar tipo de carga.');
    }
  }

  async getVehicleTypes(): Promise<VehicleType[]> {
    try {
      const response = await apiService.get<VehicleType[]>('/vehicle_types');
      return response;
    } catch (error) {
      console.error('Erro ao carregar tipos de veículo:', error);
      throw new Error('Falha ao carregar tipos de veículo.');
    }
  }

  async getVehicleTypeById(id: number): Promise<VehicleType> {
    try {
      const response = await apiService.get<VehicleType>(`/vehicle_types/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao carregar tipo de veículo:', error);
      throw new Error('Falha ao carregar tipo de veículo.');
    }
  }

  async getRoles(): Promise<{ roles: Role[] }> {
    try {
      const response = await apiService.get<{ roles: Role[] }>('/roles');
      return response;
    } catch (error) {
      console.error('Erro ao carregar papéis:', error);
      throw new Error('Falha ao carregar papéis do sistema.');
    }
  }
}

export const utilsService = new UtilsService();
export default utilsService;
