import apiService from './api';

export interface Shipment {
  id: number;
  user_id: number;
  title: string;
  description: string;
  cargo_type_id: number;
  weight_kg: number;
  volume_m3?: number;
  pickup_location: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  pickup_date: string;
  delivery_location: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  delivery_date: string;
  required_vehicle_type_id?: number;
  price_offer?: number;
  status: 'pending' | 'active' | 'in_transit' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateShipmentRequest {
  user_id: number;
  title: string;
  description?: string;
  cargo_type_id: number;
  weight_kg: number;
  volume_m3?: number;
  pickup_location: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  pickup_date: string;
  delivery_location: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  delivery_date: string;
  required_vehicle_type_id?: number;
  price_offer?: number;
}

export interface ShipmentSearchParams {
  pickup_location?: string;
  delivery_location?: string;
  cargo_type_id?: number;
  min_weight?: number;
  max_weight?: number;
  pickup_date_from?: string;
  pickup_date_to?: string;
  delivery_date_from?: string;
  delivery_date_to?: string;
  status?: string;
  page?: number;
  limit?: number;
}

class ShipmentService {
  async createShipment(shipmentData: CreateShipmentRequest): Promise<Shipment> {
    try {
      const response = await apiService.post<Shipment>('/shipments', shipmentData);
      return response;
    } catch (error) {
      console.error('Erro ao criar viagem:', error);
      throw new Error('Falha ao criar viagem. Tente novamente.');
    }
  }

  async getAllShipments(params?: ShipmentSearchParams): Promise<Shipment[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/shipments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<Shipment[]>(endpoint);
      return response;
    } catch (error) {
      console.error('Erro ao buscar viagens:', error);
      throw new Error('Falha ao carregar viagens. Tente novamente.');
    }
  }

  async getShipmentById(id: number): Promise<Shipment> {
    try {
      const response = await apiService.get<Shipment>(`/shipments/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar viagem:', error);
      throw new Error('Falha ao carregar detalhes da viagem.');
    }
  }

  async getShipmentDetails(id: number): Promise<any> {
    try {
      const response = await apiService.get<any>(`/shipments/${id}/details`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar detalhes da viagem:', error);
      throw new Error('Falha ao carregar detalhes completos da viagem.');
    }
  }

  async updateShipment(id: number, shipmentData: Partial<CreateShipmentRequest>): Promise<Shipment> {
    try {
      const response = await apiService.put<Shipment>(`/shipments/${id}`, shipmentData);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar viagem:', error);
      throw new Error('Falha ao atualizar viagem. Tente novamente.');
    }
  }

  async deleteShipment(id: number): Promise<void> {
    try {
      await apiService.delete(`/shipments/${id}`);
    } catch (error) {
      console.error('Erro ao deletar viagem:', error);
      throw new Error('Falha ao deletar viagem. Tente novamente.');
    }
  }

  async searchShipments(searchParams: ShipmentSearchParams): Promise<any> {
    try {
      const response = await apiService.post<any>('/shipments/search', searchParams);
      return response;
    } catch (error) {
      console.error('Erro ao pesquisar viagens:', error);
      throw new Error('Falha na pesquisa de viagens. Tente novamente.');
    }
  }
}

export const shipmentService = new ShipmentService();
export default shipmentService;
