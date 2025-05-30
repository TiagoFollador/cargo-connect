// Tipos de papéis de usuário no sistema
export type UserRole = 'conductor' | 'transporter';

// Interface que define a estrutura de um usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  rating: number;
  company?: string;
  verified: boolean;
}

// Interface que define a estrutura de uma viagem
export interface Trip {
  id: string;
  origin: string;
  destination: string;
  date: string;
  price: number;
  distance: string;
  weight: string;
  cargo: string;
  status: 'available' | 'accepted' | 'in_progress' | 'completed';
  createdAt: string;
  transporterId?: string;
  conductorId?: string;
}

// Interface que define a estrutura de uma contraproposta
export interface CounterOffer {
  tripId: string;
  originalPrice: number;
  offeredPrice: number;
  message?: string;
}

// Interface que define a estrutura de um veículo
export interface Vehicle {
  id: string;
  type: string;
  plate: string;
  capacity: string;
  year: number;
}