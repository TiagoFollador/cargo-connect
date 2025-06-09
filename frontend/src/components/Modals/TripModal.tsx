import React from 'react';
import { X, MapPin, Calendar, Package, DollarSign, User, Truck, Clock } from 'lucide-react';

interface TripModalProps {
  trip: any;
  isOpen: boolean;
  onClose: () => void;
  onAccept?: (tripId: string) => void;
  onCounterOffer?: (tripId: string) => void;
}

const TripModal: React.FC<TripModalProps> = ({ 
  trip, 
  isOpen, 
  onClose, 
  onAccept, 
  onCounterOffer 
}) => {
  if (!isOpen || !trip) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'pending': 'Pendente',
      'active': 'Ativa',
      'in_transit': 'Em Trânsito',
      'delivered': 'Entregue',
      'cancelled': 'Cancelada'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'active': 'bg-blue-100 text-blue-800',
      'in_transit': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-text-primary">
            {trip.title || 'Detalhes da Viagem'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
              {getStatusText(trip.status)}
            </span>
            <span className="text-sm text-text-secondary">
              ID: #{trip.id}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-primary">Origem</p>
                  <p className="text-text-secondary">{trip.pickup_location}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-primary">Destino</p>
                  <p className="text-text-secondary">{trip.delivery_location}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-primary">Data de Coleta</p>
                  <p className="text-text-secondary">{formatDate(trip.pickup_date)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-primary">Data de Entrega</p>
                  <p className="text-text-secondary">{formatDate(trip.delivery_date)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-primary">Carga</p>
                  <p className="text-text-secondary">{trip.description || 'Não especificado'}</p>
                  <p className="text-sm text-text-secondary">Peso: {trip.weight_kg}kg</p>
                  {trip.volume_m3 && (
                    <p className="text-sm text-text-secondary">Volume: {trip.volume_m3}m³</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-primary">Valor Oferecido</p>
                  <p className="text-2xl font-bold text-primary">
                    {trip.price_offer ? formatPrice(trip.price_offer) : 'A negociar'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-primary">Criado em</p>
                  <p className="text-text-secondary">{formatDate(trip.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {trip.description && (
            <div className="border-t pt-4">
              <h3 className="font-medium text-text-primary mb-2">Descrição</h3>
              <p className="text-text-secondary">{trip.description}</p>
            </div>
          )}

          {trip.status === 'pending' && (onAccept || onCounterOffer) && (
            <div className="border-t pt-4 flex gap-3">
              {onAccept && (
                <button
                  onClick={() => onAccept(trip.id)}
                  className="btn btn-primary flex-1"
                >
                  Aceitar Viagem
                </button>
              )}
              {onCounterOffer && (
                <button
                  onClick={() => onCounterOffer(trip.id)}
                  className="btn btn-secondary flex-1"
                >
                  Fazer Contra-oferta
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripModal;
