import apiService from './api';

export interface CompanyContact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface CompanyContactSearchParams {
  status?: string;
  email?: string;
  subject?: string;
  page?: number;
  limit?: number;
}

class CompanyContactService {
  async createContact(contactData: CreateCompanyContactRequest): Promise<CompanyContact> {
    try {
      const response = await apiService.post<CompanyContact>('/company-contact', contactData);
      return response;
    } catch (error) {
      console.error('Erro ao enviar mensagem de contato:', error);
      throw new Error('Falha ao enviar mensagem. Tente novamente.');
    }
  }

  async getAllContacts(params?: CompanyContactSearchParams): Promise<CompanyContact[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/company-contact${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<CompanyContact[]>(endpoint);
      return response;
    } catch (error) {
      console.error('Erro ao buscar mensagens de contato:', error);
      throw new Error('Falha ao carregar mensagens de contato. Tente novamente.');
    }
  }

  async getContactById(id: number): Promise<CompanyContact> {
    try {
      const response = await apiService.get<CompanyContact>(`/company-contact/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar mensagem de contato:', error);
      throw new Error('Falha ao carregar detalhes da mensagem de contato.');
    }
  }

  async updateContactStatus(id: number, status: 'pending' | 'in_progress' | 'resolved' | 'closed'): Promise<CompanyContact> {
    try {
      const response = await apiService.put<CompanyContact>(`/company-contact/${id}`, { status });
      return response;
    } catch (error) {
      console.error('Erro ao atualizar status da mensagem:', error);
      throw new Error('Falha ao atualizar status da mensagem. Tente novamente.');
    }
  }

  async deleteContact(id: number): Promise<void> {
    try {
      await apiService.delete(`/company-contact/${id}`);
    } catch (error) {
      console.error('Erro ao deletar mensagem de contato:', error);
      throw new Error('Falha ao deletar mensagem de contato. Tente novamente.');
    }
  }

  getStatusDisplayName(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendente',
      'in_progress': 'Em Andamento',
      'resolved': 'Resolvido',
      'closed': 'Fechado'
    };
    
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'pending': 'yellow',
      'in_progress': 'blue',
      'resolved': 'green',
      'closed': 'gray'
    };
    
    return colorMap[status] || 'gray';
  }
}

export const companyContactService = new CompanyContactService();
export default companyContactService;
