import { Trip } from '../types';

// Dados de exemplo para viagens disponíveis
export const mockTrips: Trip[] = [
  {
    id: '1',
    origin: 'São Paulo, SP',
    destination: 'Rio de Janeiro, RJ',
    date: '2025-10-25',
    price: 2500,
    distance: '430 km',
    weight: '15 toneladas',
    cargo: 'Mercadorias Gerais',
    status: 'available',
    createdAt: '2025-10-01T10:30:00Z'
  },
  {
    id: '2',
    origin: 'Belo Horizonte, MG',
    destination: 'Brasília, DF',
    date: '2025-10-28',
    price: 3200,
    distance: '736 km',
    weight: '8 toneladas',
    cargo: 'Eletrônicos',
    status: 'available',
    createdAt: '2025-10-02T14:15:00Z'
  },
  {
    id: '3',
    origin: 'Curitiba, PR',
    destination: 'Florianópolis, SC',
    date: '2025-11-03',
    price: 1800,
    distance: '300 km',
    weight: '12 toneladas',
    cargo: 'Produtos Refrigerados',
    status: 'available',
    createdAt: '2025-10-03T09:45:00Z'
  },
  {
    id: '4',
    origin: 'Recife, PE',
    destination: 'Salvador, BA',
    date: '2025-11-10',
    price: 2750,
    distance: '850 km',
    weight: '10 toneladas',
    cargo: 'Materiais de Construção',
    status: 'available',
    createdAt: '2025-10-04T16:20:00Z'
  },
  {
    id: '5',
    origin: 'Porto Alegre, RS',
    destination: 'São Paulo, SP',
    date: '2025-11-15',
    price: 4100,
    distance: '1160 km',
    weight: '18 toneladas',
    cargo: 'Peças Automotivas',
    status: 'available',
    createdAt: '2025-10-05T11:10:00Z'
  },
  {
    id: '6',
    origin: 'Manaus, AM',
    destination: 'Belém, PA',
    date: '2025-11-20',
    price: 5800,
    distance: '1650 km',
    weight: '8 toneladas',
    cargo: 'Carga Geral',
    status: 'accepted',
    createdAt: '2025-10-06T13:45:00Z'
  }
];