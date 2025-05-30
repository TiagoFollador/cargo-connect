import React from 'react';
import { MapPin, Calendar, DollarSign, TruckIcon, Package } from 'lucide-react';
import { Trip } from '../../types';

interface TripCardProps {
  trip: Trip;
  onAccept: (tripId: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onAccept }) => {
  const formattedDate = new Date(trip.date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(trip.price);

  return (
    <div className="card group hover:shadow-md overflow-hidden slide-up">
      <div className="absolute right-4 top-4 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-primary shadow-sm">
        {trip.status === 'available' ? 'Disponível' : 'Aceito'}
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-text-secondary">
            <Calendar size={14} className="mr-1" />
            {formattedDate}
          </div>
          <h3 className="text-lg font-semibold">{trip.origin} para {trip.destination}</h3>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-start space-x-2">
          <MapPin size={18} className="mt-0.5 flex-shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium">De: {trip.origin}</p>
            <p className="text-sm font-medium">Para: {trip.destination}</p>
            <p className="text-xs text-text-secondary">Distância: {trip.distance}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Package size={18} className="flex-shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium">{trip.cargo}</p>
            <p className="text-xs text-text-secondary">Peso: {trip.weight}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <DollarSign size={18} className="flex-shrink-0 text-primary" />
          <p className="text-lg font-semibold">{formattedPrice}</p>
        </div>
      </div>

      {trip.status === 'available' && (
        <div>
          <button
            onClick={() => onAccept(trip.id)}
            className="btn btn-primary w-full"
          >
            Aceitar
          </button>
        </div>
      )}
      
      {trip.status === 'accepted' && (
        <div>
          <button
            disabled
            className="btn w-full bg-success/20 text-success cursor-not-allowed"
          >
            <TruckIcon size={16} className="mr-2" />
            Viagem Aceita
          </button>
        </div>
      )}
    </div>
  );
};

export default TripCard;