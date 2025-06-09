import apiService from './api';

export interface UserReview {
  id: number;
  reviewer_id: number;
  reviewed_user_id: number;
  contract_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserReviewRequest {
  reviewer_id: number;
  reviewed_user_id: number;
  contract_id: number;
  rating: number;
  comment?: string;
}

export interface UserReviewSearchParams {
  reviewer_id?: number;
  reviewed_user_id?: number;
  contract_id?: number;
  min_rating?: number;
  max_rating?: number;
  page?: number;
  limit?: number;
}

export interface UserReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    [key: number]: number;
  };
}

class UserReviewService {
  async createReview(reviewData: CreateUserReviewRequest): Promise<UserReview> {
    try {
      const response = await apiService.post<UserReview>('/user-reviews', reviewData);
      return response;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw new Error('Falha ao criar avaliação. Tente novamente.');
    }
  }

  async getAllReviews(params?: UserReviewSearchParams): Promise<UserReview[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/user-reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<UserReview[]>(endpoint);
      return response;
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      throw new Error('Falha ao carregar avaliações. Tente novamente.');
    }
  }

  async getReviewById(id: number): Promise<UserReview> {
    try {
      const response = await apiService.get<UserReview>(`/user-reviews/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
      throw new Error('Falha ao carregar detalhes da avaliação.');
    }
  }

  async getReviewsByUserId(userId: number): Promise<UserReview[]> {
    try {
      const response = await apiService.get<UserReview[]>(`/user-reviews/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar avaliações do usuário:', error);
      throw new Error('Falha ao carregar avaliações do usuário.');
    }
  }

  async getReviewsByReviewerId(reviewerId: number): Promise<UserReview[]> {
    try {
      const response = await apiService.get<UserReview[]>(`/user-reviews/reviewer/${reviewerId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar avaliações feitas pelo usuário:', error);
      throw new Error('Falha ao carregar avaliações feitas pelo usuário.');
    }
  }

  async updateReview(id: number, reviewData: Partial<CreateUserReviewRequest>): Promise<UserReview> {
    try {
      const response = await apiService.put<UserReview>(`/user-reviews/${id}`, reviewData);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      throw new Error('Falha ao atualizar avaliação. Tente novamente.');
    }
  }

  async deleteReview(id: number): Promise<void> {
    try {
      await apiService.delete(`/user-reviews/${id}`);
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      throw new Error('Falha ao deletar avaliação. Tente novamente.');
    }
  }

  async getUserReviewStats(userId: number): Promise<UserReviewStats> {
    try {
      const reviews = await this.getReviewsByUserId(userId);
      
      if (reviews.length === 0) {
        return {
          average_rating: 0,
          total_reviews: 0,
          rating_distribution: {}
        };
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      const ratingDistribution: { [key: number]: number } = {};
      reviews.forEach(review => {
        ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
      });

      return {
        average_rating: Math.round(averageRating * 10) / 10,
        total_reviews: reviews.length,
        rating_distribution: ratingDistribution
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas de avaliações:', error);
      throw new Error('Falha ao carregar estatísticas de avaliações.');
    }
  }
}

export const userReviewService = new UserReviewService();
export default userReviewService;
