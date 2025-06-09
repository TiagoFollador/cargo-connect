import apiService from './api';

export interface ShipperDashboardSummary {
  total_shipments: number;
  active_shipments: number;
  completed_shipments: number;
  pending_shipments: number;
  total_spent: number;
  average_rating_given: number;
  recent_shipments: any[];
}

export interface CarrierDashboardSummary {
  total_offers: number;
  accepted_offers: number;
  completed_trips: number;
  active_trips: number;
  total_revenue: number;
  average_rating: number;
  recent_trips: any[];
  vehicle_status: any[];
}

export interface DashboardChartData {
  labels: string[];
  data: number[];
  type: 'revenue' | 'trips' | 'offers';
}

class DashboardService {
  async getShipperSummary(): Promise<ShipperDashboardSummary> {
    try {
      const response = await apiService.get<ShipperDashboardSummary>('/dashboard/shipper/summary');
      return response;
    } catch (error) {
      console.error('Erro ao carregar resumo do embarcador:', error);
      throw new Error('Falha ao carregar dados do painel do embarcador.');
    }
  }

  async getCarrierSummary(): Promise<CarrierDashboardSummary> {
    try {
      const response = await apiService.get<CarrierDashboardSummary>('/dashboard/carrier/summary');
      return response;
    } catch (error) {
      console.error('Erro ao carregar resumo do transportador:', error);
      throw new Error('Falha ao carregar dados do painel do transportador.');
    }
  }

  async getCarrierRecentTrips(): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>('/dashboard/carrier/recent-trips');
      return response;
    } catch (error) {
      console.error('Erro ao carregar viagens recentes:', error);
      throw new Error('Falha ao carregar viagens recentes.');
    }
  }

  async getCarrierRevenueChart(period: 'week' | 'month' | 'year' = 'month'): Promise<DashboardChartData> {
    try {
      const response = await apiService.get<DashboardChartData>(`/dashboard/carrier/charts/revenue?period=${period}`);
      return response;
    } catch (error) {
      console.error('Erro ao carregar gráfico de receita:', error);
      throw new Error('Falha ao carregar dados do gráfico de receita.');
    }
  }

  async getShipperSpendingChart(period: 'week' | 'month' | 'year' = 'month'): Promise<DashboardChartData> {
    try {
      const response = await apiService.get<DashboardChartData>(`/dashboard/shipper/charts/spending?period=${period}`);
      return response;
    } catch (error) {
      console.error('Erro ao carregar gráfico de gastos:', error);
      throw new Error('Falha ao carregar dados do gráfico de gastos.');
    }
  }

  async getShipperRecentShipments(): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>('/dashboard/shipper/recent-shipments');
      return response;
    } catch (error) {
      console.error('Erro ao carregar embarques recentes:', error);
      throw new Error('Falha ao carregar embarques recentes.');
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
