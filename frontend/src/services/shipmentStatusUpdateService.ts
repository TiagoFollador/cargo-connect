import apiService from './api';

export interface ShipmentStatusUpdate {
  id: number;
  contract_id: number;
  status: 'pickup_scheduled' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled';
  location?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateShipmentStatusUpdateRequest {
  contract_id: number;
  status: 'pickup_scheduled' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled';
  location?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  estimated_delivery?: string;
}

export interface ShipmentStatusUpdateSearchParams {
  contract_id?: number;
  status?: string;
  page?: number;
  limit?: number;
}

class ShipmentStatusUpdateService {
  async createStatusUpdate(updateData: CreateShipmentStatusUpdateRequest): Promise<ShipmentStatusUpdate> {
    try {
      const response = await apiService.post<ShipmentStatusUpdate>('/shipment-status-updates', updateData);
      return response;
    } catch (error) {
      console.error('Erro ao criar atualização de status:', error);
      throw new Error('Falha ao criar atualização de status. Tente novamente.');
    }
  }

  async getStatusUpdateById(id: number): Promise<ShipmentStatusUpdate> {
    try {
      const response = await apiService.get<ShipmentStatusUpdate>(`/shipment-status-updates/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar atualização de status:', error);
      throw new Error('Falha ao carregar detalhes da atualização de status.');
    }
  }

  async getStatusUpdatesByContractId(contractId: number): Promise<ShipmentStatusUpdate[]> {
    try {
      const response = await apiService.get<ShipmentStatusUpdate[]>(`/shipment-status-updates/contract/${contractId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar atualizações de status do contrato:', error);
      throw new Error('Falha ao carregar atualizações de status do contrato.');
    }
  }

  async updateStatusUpdate(id: number, updateData: Partial<CreateShipmentStatusUpdateRequest>): Promise<ShipmentStatusUpdate> {
    try {
      const response = await apiService.put<ShipmentStatusUpdate>(`/shipment-status-updates/${id}`, updateData);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw new Error('Falha ao atualizar status. Tente novamente.');
    }
  }

  async deleteStatusUpdate(id: number): Promise<void> {
    try {
      await apiService.delete(`/shipment-status-updates/${id}`);
    } catch (error) {
      console.error('Erro ao deletar atualização de status:', error);
      throw new Error('Falha ao deletar atualização de status. Tente novamente.');
    }
  }

  async getLatestStatusByContractId(contractId: number): Promise<ShipmentStatusUpdate | null> {
    try {
      const updates = await this.getStatusUpdatesByContractId(contractId);
      if (updates.length === 0) return null;

      return updates.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    } catch (error) {
      console.error('Erro ao buscar status mais recente:', error);
      throw new Error('Falha ao carregar status mais recente.');
    }
  }

  getStatusDisplayName(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pickup_scheduled': 'Coleta Agendada',
      'in_transit': 'Em Trânsito',
      'delivered': 'Entregue',
      'delayed': 'Atrasado',
      'cancelled': 'Cancelado'
    };

    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'pickup_scheduled': 'blue',
      'in_transit': 'yellow',
      'delivered': 'green',
      'delayed': 'orange',
      'cancelled': 'red'
    };

    return colorMap[status] || 'gray';
  }
}

export const shipmentStatusUpdateService = new ShipmentStatusUpdateService();
export default shipmentStatusUpdateService;
