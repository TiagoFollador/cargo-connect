import apiService from './api';

export interface ShipmentContract {
  id: number;
  shipment_id: number;
  offer_id: number;
  shipper_id: number;
  carrier_id: number;
  agreed_price: number;
  agreed_pickup_date: string;
  agreed_delivery_date: string;
  contract_terms?: string;
  status: 'active' | 'completed' | 'cancelled' | 'disputed';
  created_at: string;
  updated_at: string;
}

export interface CreateShipmentContractRequest {
  shipment_id: number;
  offer_id: number;
  shipper_id: number;
  carrier_id: number;
  agreed_price: number;
  agreed_pickup_date: string;
  agreed_delivery_date: string;
  contract_terms?: string;
}

export interface ShipmentContractSearchParams {
  status?: string;
  shipper_id?: number;
  carrier_id?: number;
  shipment_id?: number;
  page?: number;
  limit?: number;
}

class ShipmentContractService {
  async createContract(contractData: CreateShipmentContractRequest): Promise<ShipmentContract> {
    try {
      const response = await apiService.post<ShipmentContract>('/shipment_contracts', contractData);
      return response;
    } catch (error) {
      console.error('Erro ao criar contrato:', error);
      throw new Error('Falha ao criar contrato. Tente novamente.');
    }
  }

  async getAllContracts(params?: ShipmentContractSearchParams): Promise<ShipmentContract[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/shipment_contracts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<ShipmentContract[]>(endpoint);
      return response;
    } catch (error) {
      console.error('Erro ao buscar contratos:', error);
      throw new Error('Falha ao carregar contratos. Tente novamente.');
    }
  }

  async getContractById(id: number): Promise<ShipmentContract> {
    try {
      const response = await apiService.get<ShipmentContract>(`/shipment_contracts/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar contrato:', error);
      throw new Error('Falha ao carregar detalhes do contrato.');
    }
  }

  async getContractByShipmentId(shipmentId: number): Promise<ShipmentContract> {
    try {
      const response = await apiService.get<ShipmentContract>(`/shipment_contracts/shipment/${shipmentId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar contrato da viagem:', error);
      throw new Error('Falha ao carregar contrato da viagem.');
    }
  }

  async updateContract(id: number, contractData: Partial<CreateShipmentContractRequest>): Promise<ShipmentContract> {
    try {
      const response = await apiService.put<ShipmentContract>(`/shipment_contracts/${id}`, contractData);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar contrato:', error);
      throw new Error('Falha ao atualizar contrato. Tente novamente.');
    }
  }

  async deleteContract(id: number): Promise<void> {
    try {
      await apiService.delete(`/shipment_contracts/${id}`);
    } catch (error) {
      console.error('Erro ao deletar contrato:', error);
      throw new Error('Falha ao deletar contrato. Tente novamente.');
    }
  }

  async completeContract(id: number): Promise<ShipmentContract> {
    try {
      const response = await apiService.put<ShipmentContract>(`/shipment_contracts/${id}`, { status: 'completed' });
      return response;
    } catch (error) {
      console.error('Erro ao finalizar contrato:', error);
      throw new Error('Falha ao finalizar contrato. Tente novamente.');
    }
  }

  async cancelContract(id: number): Promise<ShipmentContract> {
    try {
      const response = await apiService.put<ShipmentContract>(`/shipment_contracts/${id}`, { status: 'cancelled' });
      return response;
    } catch (error) {
      console.error('Erro ao cancelar contrato:', error);
      throw new Error('Falha ao cancelar contrato. Tente novamente.');
    }
  }
}

export const shipmentContractService = new ShipmentContractService();
export default shipmentContractService;
