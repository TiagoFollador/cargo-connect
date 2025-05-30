import React from 'react';
import Modal from '../UI/Modal';
import { Trip } from '../../types';
import { MapPin, Calendar, DollarSign } from 'lucide-react';

interface AcceptTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  trip: Trip | null;
}

const AcceptTripModal: React.FC<AcceptTripModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  trip
}) => {
  if (!trip) return null;

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
    <Modal isOpen={isOpen} onClose={onClose} title="Aceitar Viagem">
      <div className="space-y-4">
        <p className="text-text-secondary">
          Você está prestes a aceitar a seguinte viagem:
        </p>

        <div className="rounded-md bg-background p-4">
          <div className="mb-3 space-y-2">
            <div className="flex items-center">
              <MapPin size={18} className="mr-2 text-primary" />
              <span className="font-medium">
                {trip.origin} → {trip.destination}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar size={18} className="mr-2 text-primary" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <DollarSign size={18} className="mr-2 text-primary" />
              <span className="text-lg font-semibold">{formattedPrice}</span>
            </div>
          </div>
          
          <div className="text-sm text-text-secondary">
            <p><span className="font-medium">Carga:</span> {trip.cargo}</p>
            <p><span className="font-medium">Peso:</span> {trip.weight}</p>
            <p><span className="font-medium">Distância:</span> {trip.distance}</p>
          </div>
        </div>

        <p className="text-sm text-text-secondary">
          Ao aceitar esta viagem, você concorda em transportar a carga da origem até o destino
          pelo preço especificado e na data especificada.
        </p>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn btn-outline"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-primary"
          >
            Confirmar Aceitação
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AcceptTripModal;