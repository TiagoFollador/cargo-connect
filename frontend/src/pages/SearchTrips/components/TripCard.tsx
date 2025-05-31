import { Calendar, MapPin, Package, DollarSign, TruckIcon } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onAccept?: (id: number) => void;
  onCounterOffer?: (id: number) => void;
}

export function TripCard({ trip, onAccept, onCounterOffer }: TripCardProps) {
  // Format date
  const formattedDate = new Date(trip.pickup_date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Format price
  const formattedPrice = trip.price_offer?.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }) || 'Preço a combinar';

  // Mock distance calculation (you would replace with real calculation)
  const distance = "500 km"; 

  // Get cargo type name (would come from your cargoTypes data)
  const cargoType = getCargoTypeName(trip.cargo_type_id); 

  return (
    <div className="card group hover:shadow-md overflow-hidden slide-up">
      <div className={`absolute right-4 top-4 rounded-full bg-white/90 px-2 py-1 text-xs font-medium ${
        trip.status === 'pending' ? 'text-primary' : 'text-success'
      } shadow-sm`}>
        {trip.status === 'pending' ? 'Disponível' : 
         trip.status === 'active' ? 'Aceito' :
         trip.status === 'in_transit' ? 'Em trânsito' :
         trip.status === 'delivered' ? 'Entregue' : 'Cancelado'}
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-text-secondary">
            <Calendar size={14} className="mr-1" />
            {formattedDate}
          </div>
          <h3 className="text-lg font-semibold">
            {trip.pickup_location} para {trip.delivery_location}
          </h3>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-start space-x-2">
          <MapPin size={18} className="mt-0.5 flex-shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium">De: {trip.pickup_location}</p>
            <p className="text-sm font-medium">Para: {trip.delivery_location}</p>
            <p className="text-xs text-text-secondary">Distância: {distance}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Package size={18} className="flex-shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium">{cargoType}</p>
            <p className="text-xs text-text-secondary">
              Peso: {trip.weight_kg.toLocaleString('pt-BR')} kg
              {trip.volume_m3 && ` • Volume: ${trip.volume_m3} m³`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <DollarSign size={18} className="flex-shrink-0 text-primary" />
          <p className="text-lg font-semibold">{formattedPrice}</p>
        </div>
      </div>

      {trip.status === 'pending' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onAccept?.(trip.id)}
            className="btn btn-primary flex-1"
          >
            Aceitar
          </button>
          <button
            onClick={() => onCounterOffer?.(trip.id)}
            className="btn btn-outline flex-1"
          >
            Contraproposta
          </button>
        </div>
      )}
      
      {trip.status !== 'pending' && (
        <div>
          <button
            disabled
            className={`btn w-full ${
              trip.status === 'active' ? 'bg-success/20 text-success' :
              trip.status === 'in_transit' ? 'bg-info/20 text-info' :
              trip.status === 'delivered' ? 'bg-secondary/20 text-secondary' :
              'bg-error/20 text-error'
            } cursor-not-allowed`}
          >
            <TruckIcon size={16} className="mr-2" />
            {trip.status === 'active' ? 'Viagem Aceita' :
             trip.status === 'in_transit' ? 'Em Trânsito' :
             trip.status === 'delivered' ? 'Entregue' : 'Cancelada'}
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function (you would replace with your actual data lookup)
function getCargoTypeName(id: number): string {
  const cargoTypes: Record<number, string> = {
    1: 'Animais',
    2: 'Material de Construção',
    3: 'Comida',
    4: 'Grãos',
    5: 'Móveis',
    6: 'Eletrônicos'
  };
  return cargoTypes[id] || 'Carga Geral';
}