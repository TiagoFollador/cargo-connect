import React, { useState } from 'react';
import SearchField from './components/SearchField';
import { Trip } from './type';
import { TripCard } from './components/TripCard';

const mockData: Trip[] = [
  {
    id: 1,
    user_id: 101,
    title: "Transporte de Grãos de Soja",
    description: "Transporte de 20 toneladas de soja para exportação",
    cargo_type_id: 4, // Grãos
    weight_kg: 20000,
    volume_m3: 50,
    pickup_location: "Sorriso, MT",
    pickup_latitude: -12.542,
    pickup_longitude: -55.721,
    pickup_date: "2023-07-15T08:00:00Z",
    delivery_location: "Santos, SP",
    delivery_latitude: -23.960,
    delivery_longitude: -46.333,
    delivery_date: "2023-07-20T18:00:00Z",
    required_vehicle_type_id: 1, // Caminhão Baú
    price_offer: 8500,
    status: "pending",
    created_at: "2023-06-25T10:30:00Z",
    updated_at: "2023-06-25T10:30:00Z"
  },
  {
    id: 2,
    user_id: 102,
    title: "Móveis Residenciais",
    description: "Transporte de móveis para casa nova",
    cargo_type_id: 5, // Móveis
    weight_kg: 3500,
    volume_m3: 45,
    pickup_location: "São Paulo, SP",
    pickup_latitude: -23.548,
    pickup_longitude: -46.636,
    pickup_date: "2023-07-10T09:00:00Z",
    delivery_location: "Rio de Janeiro, RJ",
    delivery_latitude: -22.906,
    delivery_longitude: -43.172,
    delivery_date: "2023-07-11T17:00:00Z",
    required_vehicle_type_id: 3, // Caminhão Aberto
    price_offer: 3200,
    status: "active",
    created_at: "2023-06-26T14:20:00Z",
    updated_at: "2023-06-28T09:15:00Z"
  },
  {
    id: 3,
    user_id: 103,
    title: "Carga de Eletrônicos",
    description: "Transporte de equipamentos eletrônicos frágeis",
    cargo_type_id: 6, // Eletrônicos
    weight_kg: 1800,
    volume_m3: 25,
    pickup_location: "Campinas, SP",
    pickup_latitude: -22.905,
    pickup_longitude: -47.061,
    pickup_date: "2023-07-18T10:00:00Z",
    delivery_location: "Brasília, DF",
    delivery_latitude: -15.797,
    delivery_longitude: -47.891,
    delivery_date: "2023-07-20T15:00:00Z",
    required_vehicle_type_id: 1, // Caminhão Baú
    price_offer: 4500,
    status: "pending",
    created_at: "2023-06-27T09:15:00Z",
    updated_at: "2023-06-27T09:15:00Z"
  },
  {
    id: 4,
    user_id: 104,
    title: "Transporte de Gado",
    description: "Transporte de 50 cabeças de gado",
    cargo_type_id: 1, // Animais
    weight_kg: 18000,
    volume_m3: 70,
    pickup_location: "Cuiabá, MT",
    pickup_latitude: -15.601,
    pickup_longitude: -56.097,
    pickup_date: "2023-07-22T06:00:00Z",
    delivery_location: "Goiânia, GO",
    delivery_latitude: -16.686,
    delivery_longitude: -49.264,
    delivery_date: "2023-07-24T14:00:00Z",
    required_vehicle_type_id: 4, // Caminhão Frigorífico
    price_offer: 12000,
    status: "in_transit",
    created_at: "2023-06-28T11:40:00Z",
    updated_at: "2023-07-05T08:20:00Z"
  },
  {
    id: 5,
    user_id: 105,
    title: "Material de Construção",
    description: "Transporte de tijolos e cimento",
    cargo_type_id: 2, // Material de Construção
    weight_kg: 15000,
    volume_m3: 35,
    pickup_location: "Porto Alegre, RS",
    pickup_latitude: -30.033,
    pickup_longitude: -51.230,
    pickup_date: "2023-07-05T07:00:00Z",
    delivery_location: "Florianópolis, SC",
    delivery_latitude: -27.596,
    delivery_longitude: -48.549,
    delivery_date: "2023-07-05T19:00:00Z",
    required_vehicle_type_id: 2, // Carreta
    price_offer: 6800,
    status: "delivered",
    created_at: "2023-06-20T08:15:00Z",
    updated_at: "2023-07-06T12:30:00Z"
  },
  {
    id: 6,
    user_id: 106,
    title: "Produtos Alimentícios",
    description: "Transporte de alimentos perecíveis",
    cargo_type_id: 3, // Comida
    weight_kg: 8000,
    volume_m3: 30,
    pickup_location: "Curitiba, PR",
    pickup_latitude: -25.428,
    pickup_longitude: -49.273,
    pickup_date: "2023-07-12T05:00:00Z",
    delivery_location: "São Paulo, SP",
    delivery_latitude: -23.548,
    delivery_longitude: -46.636,
    delivery_date: "2023-07-12T15:00:00Z",
    required_vehicle_type_id: 4, // Caminhão Frigorífico
    price_offer: 5500,
    status: "cancelled",
    created_at: "2023-06-15T13:25:00Z",
    updated_at: "2023-06-30T10:45:00Z"
  }
];

const SearchTripsPage = () => {
  const [filterData, setFilterData] = useState(mockData);
  return (
    <div>
      <h1>Search Trips Page</h1>
        <SearchField trips={mockData} setFilteredTrips={setFilterData} />

      {filterData.map((trip) => (
          <TripCard key={trip.id} trip={trip} onAccept={() => {}}
          onCounterOffer={() => {}} />
        ))}
    </div>
  );
};

export default SearchTripsPage;