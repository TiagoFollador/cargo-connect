import apiService from './api';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  related_entity_type?: string;
  related_entity_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationRequest {
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  related_entity_type?: string;
  related_entity_id?: number;
}

export interface NotificationSearchParams {
  user_id?: number;
  type?: string;
  is_read?: boolean;
  page?: number;
  limit?: number;
}

class NotificationService {
  async createNotification(notificationData: CreateNotificationRequest): Promise<Notification> {
    try {
      const response = await apiService.post<Notification>('/notifications', notificationData);
      return response;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw new Error('Falha ao criar notificação. Tente novamente.');
    }
  }

  async getAllNotifications(params?: NotificationSearchParams): Promise<Notification[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<Notification[]>(endpoint);
      return response;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw new Error('Falha ao carregar notificações. Tente novamente.');
    }
  }

  async getNotificationById(id: number): Promise<Notification> {
    try {
      const response = await apiService.get<Notification>(`/notifications/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar notificação:', error);
      throw new Error('Falha ao carregar detalhes da notificação.');
    }
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    try {
      const response = await apiService.get<Notification[]>(`/notifications/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar notificações do usuário:', error);
      throw new Error('Falha ao carregar notificações do usuário.');
    }
  }

  async markAsRead(id: number): Promise<Notification> {
    try {
      const response = await apiService.put<Notification>(`/notifications/${id}/read`);
      return response;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw new Error('Falha ao marcar notificação como lida.');
    }
  }

  async markAllAsRead(userId: number): Promise<void> {
    try {
      await apiService.put(`/notifications/user/${userId}/read-all`);
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      throw new Error('Falha ao marcar todas as notificações como lidas.');
    }
  }

  async deleteNotification(id: number): Promise<void> {
    try {
      await apiService.delete(`/notifications/${id}`);
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      throw new Error('Falha ao deletar notificação. Tente novamente.');
    }
  }

  async getUnreadCount(userId: number): Promise<number> {
    try {
      const notifications = await this.getNotificationsByUserId(userId);
      return notifications.filter(n => !n.is_read).length;
    } catch (error) {
      console.error('Erro ao buscar contagem de notificações não lidas:', error);
      return 0;
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
