import apiService from './api';

export interface ShipmentOffer {
  id: number;
  shipment_id: number;
  user_id: number;
  vehicle_id: number;
  proposed_price: number;
  proposed_pickup_date: string;
  proposed_delivery_date: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateShipmentOfferRequest {
  shipment_id: number;
  user_id: number;
  vehicle_id: number;
  proposed_price: number;
  proposed_pickup_date: string;
  proposed_delivery_date: string;
  notes?: string;
}

export interface ShipmentOfferSearchParams {
  status?: string;
  shipment_id?: number;
  user_id?: number;
  page?: number;
  limit?: number;
}

class ShipmentOfferService {
  async createOffer(offerData: CreateShipmentOfferRequest): Promise<ShipmentOffer> {
    try {
      const response = await apiService.post<ShipmentOffer>('/shipment_offers', offerData);
      return response;
    } catch (error) {
      console.error('Erro ao criar oferta:', error);
      throw new Error('Falha ao criar oferta. Tente novamente.');
    }
  }

  async getAllOffers(params?: ShipmentOfferSearchParams): Promise<ShipmentOffer[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/shipment_offers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<ShipmentOffer[]>(endpoint);
      return response;
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error);
      throw new Error('Falha ao carregar ofertas. Tente novamente.');
    }
  }

  async getOfferById(id: number): Promise<ShipmentOffer> {
    try {
      const response = await apiService.get<ShipmentOffer>(`/shipment_offers/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar oferta:', error);
      throw new Error('Falha ao carregar detalhes da oferta.');
    }
  }

  async getOffersByShipmentId(shipmentId: number): Promise<ShipmentOffer[]> {
    try {
      const response = await apiService.get<ShipmentOffer[]>(`/shipment_offers/shipment/${shipmentId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar ofertas da viagem:', error);
      throw new Error('Falha ao carregar ofertas da viagem.');
    }
  }

  async getOffersByUserId(userId: number): Promise<ShipmentOffer[]> {
    try {
      const response = await apiService.get<ShipmentOffer[]>(`/shipment_offers/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar ofertas do usuário:', error);
      throw new Error('Falha ao carregar ofertas do usuário.');
    }
  }

  async updateOffer(id: number, offerData: Partial<CreateShipmentOfferRequest>): Promise<ShipmentOffer> {
    try {
      const response = await apiService.put<ShipmentOffer>(`/shipment_offers/${id}`, offerData);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar oferta:', error);
      throw new Error('Falha ao atualizar oferta. Tente novamente.');
    }
  }

  async deleteOffer(id: number): Promise<void> {
    try {
      await apiService.delete(`/shipment_offers/${id}`);
    } catch (error) {
      console.error('Erro ao deletar oferta:', error);
      throw new Error('Falha ao deletar oferta. Tente novamente.');
    }
  }

  async updateStatusShipmentOffer (shipmentId: number, payload: {status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'withdrawn', newPrice?: Number}): Promise<any> {
  try {
      const response = await apiService.put(`/shipment_offers/status/${shipmentId}`, payload);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar oferta:', error);
      throw new Error('Falha ao atualizar status da oferta. Tente novamente.');
    }
};


}

export const shipmentOfferService = new ShipmentOfferService();
export default shipmentOfferService;
