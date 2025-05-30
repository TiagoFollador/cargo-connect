import React, { useState } from 'react';
import Modal from '../UI/Modal';
import { Trip } from '../../types';
import { DollarSign } from 'lucide-react';

interface CounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (offeredPrice: number, message: string) => void;
  trip: Trip | null;
}

const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  trip
}) => {
  const [offeredPrice, setOfferedPrice] = useState(trip ? trip.price * 0.9 : 0);
  const [message, setMessage] = useState('');

  if (!trip) return null;

  const formattedOriginalPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(trip.price);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(offeredPrice, message);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enviar Contraproposta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="mb-2 text-text-secondary">
            Viagem: <span className="font-medium">{trip.origin} para {trip.destination}</span>
          </p>
          <p className="mb-4 text-text-secondary">
            Preço original: <span className="font-medium">{formattedOriginalPrice}</span>
          </p>
        </div>

        <div>
          <label htmlFor="offeredPrice" className="mb-1 block text-sm font-medium">
            Sua Oferta
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign size={16} className="text-text-secondary" />
            </div>
            <input
              type="number"
              id="offeredPrice"
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(Number(e.target.value))}
              min={1}
              step="0.01"
              className="input pl-8 w-full"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium">
            Mensagem (Opcional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="input w-full"
            placeholder="Explique por que você está oferecendo este preço..."
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-secondary"
          >
            Enviar Oferta
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CounterOfferModal;