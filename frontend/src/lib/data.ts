import { User, Shipment, Testimonial, DashboardStats } from './types';

// Mock users
export const mockUsers: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    role: 'remetente',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8,
    transportCount: 124,
    notificationCount: 3
  },
  'user-2': {
    id: 'user-2',
    name: 'Sara Johnson',
    email: 'sara@exemplo.com',
    role: 'transportador',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.9,
    transportCount: 87,
    notificationCount: 5
  }
};

// Mock shipments
export const mockShipments: Shipment[] = [
  {
    id: 'ship-1',
    title: 'Transporte de Móveis',
    origin: 'São Paulo, SP',
    destination: 'Rio de Janeiro, RJ',
    price: 850,
    distance: '432 km',
    cargoType: 'Geral',
    vehicleType: 'Caminhão',
    weight: '2 toneladas',
    status: 'ativo',
    date: '2025-05-15',
    carrierId: 'user-2',
    carrierName: 'Sara Johnson',
    carrierAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
    carrierRating: 4.9,
    shipperId: 'user-1',
    shipperName: 'João Silva',
    shipperAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    shipperRating: 4.8
  },
  {
    id: 'ship-2',
    title: 'Entrega de Eletrônicos',
    origin: 'Curitiba, PR',
    destination: 'Florianópolis, SC',
    price: 420,
    distance: '300 km',
    cargoType: 'Geral',
    vehicleType: 'Van',
    weight: '0.5 toneladas',
    status: 'pendente',
    date: '2025-05-20',
    shipperId: 'user-1',
    shipperName: 'João Silva',
    shipperAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    shipperRating: 4.8
  },
  {
    id: 'ship-3',
    title: 'Transporte de Alimentos Refrigorados',
    origin: 'Belo Horizonte, MG',
    destination: 'Vitória, ES',
    price: 850,
    distance: '524 km',
    cargoType: 'Refrigerado',
    vehicleType: 'Caminhão Refrigorado',
    weight: '1.5 toneladas',
    status: 'concluído',
    date: '2025-05-10',
    carrierId: 'user-2',
    carrierName: 'Sara Johnson',
    carrierAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
    carrierRating: 4.9,
    shipperId: 'user-1',
    shipperName: 'João Silva',
    shipperAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    shipperRating: 4.8
  },
  {
    id: 'ship-4',
    title: 'Materiais de Construção',
    origin: 'Brasília, DF',
    destination: 'Goiânia, GO',
    price: 1200,
    distance: '209 km',
    cargoType: 'Pesado',
    vehicleType: 'Semi-Trailer',
    weight: '8 toneladas',
    status: 'ativo',
    date: '2025-05-18',
    carrierId: 'user-2',
    carrierName: 'Sara Johnson',
    carrierAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
    carrierRating: 4.9,
    shipperId: 'user-1',
    shipperName: 'João Silva',
    shipperAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    shipperRating: 4.8
  },
  {
    id: 'ship-5',
    title: 'Transporte de Químicos',
    origin: 'Recife, PE',
    destination: 'João Pessoa, PB',
    price: 780,
    distance: '120 km',
    cargoType: 'Perigoso',
    vehicleType: 'Tanque',
    weight: '4 toneladas',
    status: 'pendente',
    date: '2025-05-25',
    shipperId: 'user-1',
    shipperName: 'João Silva',
    shipperAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    shipperRating: 4.8
  }
];

// Mock testimonials
export const mockTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Miguel Marrom',
    role: 'remetente',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 5,
    text: 'O CargoConnect transformou nossas operações logísticas. Reduzimos custos em 20% e melhoramos significativamente os tempos de entrega.',
    company: 'Empresas Marrom'
  },
  {
    id: 'test-2',
    name: 'Jessica Lee',
    role: 'transportador',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.5,
    text: 'Como transportador independente, esta plataforma me ajudou a encontrar trabalho consistente e a crescer meu negócio. A interface é intuitiva e a equipe de suporte é incrível.',
    company: 'Lee Logistics'
  },
  {
    id: 'test-3',
    name: 'Robert Garcia',
    role: 'remetente',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 5,
    text: 'Encontrar transportadores confiáveis era nosso maior desafio. Com o CargoConnect, podemos encontrar rapidamente transportadores confiáveis e rastrear fretes em tempo real.',
    company: 'Garcia Industries'
  }
];

// Dashboard stats
export const mockDashboardStats: Record<string, DashboardStats> = {
  'user-1': {
    completedShipments: 87,
    activeShipments: 3,
    pendingOffers: 2,
    totalRevenue: 125000
  },
  'user-2': {
    completedShipments: 64,
    activeShipments: 2,
    pendingOffers: 5,
    totalRevenue: 87500,
    monthlyRevenue: 12500
  }
};

// Helper functions
export const getShipmentsByUserId = (userId: string, role: 'remetente' | 'transportador') => {
  const fieldToCheck = role === 'remetente' ? 'shipperId' : 'carrierId';
  return mockShipments.filter(shipment => shipment[fieldToCheck] === userId);
};

