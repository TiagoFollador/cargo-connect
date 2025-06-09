import apiService from './api';

export interface LandingPageData {
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_text?: string;
  features?: Feature[];
  testimonials?: Testimonial[];
  stats?: Stat[];
  about_text?: string;
  contact_info?: ContactInfo;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon?: string;
  order: number;
}

export interface Testimonial {
  id: number;
  name: string;
  company?: string;
  text: string;
  rating: number;
  avatar_url?: string;
  order: number;
}

export interface Stat {
  id: number;
  label: string;
  value: string;
  description?: string;
  order: number;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  business_hours?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

class LandingPageService {
  async getLandingPageData(): Promise<LandingPageData> {
    try {
      const response = await apiService.get<LandingPageData>('/landingpage');
      return response;
    } catch (error) {
      console.error('Erro ao carregar dados da landing page:', error);
      throw new Error('Falha ao carregar dados da página inicial.');
    }
  }

  async updateLandingPageData(data: Partial<LandingPageData>): Promise<LandingPageData> {
    try {
      const response = await apiService.put<LandingPageData>('/landingpage', data);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar dados da landing page:', error);
      throw new Error('Falha ao atualizar dados da página inicial.');
    }
  }

  async getFeatures(): Promise<Feature[]> {
    try {
      const data = await this.getLandingPageData();
      return data.features || [];
    } catch (error) {
      console.error('Erro ao carregar funcionalidades:', error);
      return [];
    }
  }

  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const data = await this.getLandingPageData();
      return data.testimonials || [];
    } catch (error) {
      console.error('Erro ao carregar depoimentos:', error);
      return [];
    }
  }

  async getStats(): Promise<Stat[]> {
    try {
      const data = await this.getLandingPageData();
      return data.stats || [];
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      return [];
    }
  }

  async getContactInfo(): Promise<ContactInfo | null> {
    try {
      const data = await this.getLandingPageData();
      return data.contact_info || null;
    } catch (error) {
      console.error('Erro ao carregar informações de contato:', error);
      return null;
    }
  }


}

export const landingPageService = new LandingPageService();
export default landingPageService;
