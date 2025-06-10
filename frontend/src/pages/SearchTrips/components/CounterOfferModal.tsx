import React, { useState, useEffect } from "react";
import { X, DollarSign } from "lucide-react";
import { Trip } from "../type";

interface CounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
  onSubmit: (tripId: number, offer: number) => void;
}

const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
  isOpen,
  onClose,
  trip,
  onSubmit,
}) => {
  const [priceOffer, setPriceOffer] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (trip) {
      setPriceOffer(trip.price_offer ? trip.price_offer.toString() : "");
    } else {
      setPriceOffer("");
    }
    setError(""); 
  }, [trip, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceOffer(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const offer = parseFloat(priceOffer);
    if (isNaN(offer) || offer <= 0) {
      setError("Por favor, insira um valor de oferta válido e positivo.");
      return;
    }
    if (trip) {
      onSubmit(trip.id, offer);
    }
  };

  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Fazer Contraproposta
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={24} />
          </button>
        </div>
        <p className="text-sm text-text-secondary mb-1">
          Viagem: <span className="font-medium">{trip.title}</span>
        </p>
        <p className="text-sm text-text-secondary mb-4">
          Oferta Atual: <span className="font-medium">{trip.price_offer ? `R$${trip.price_offer.toLocaleString('pt-BR')}` : 'A combinar'}</span>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="price_offer"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Sua Oferta de Preço (R$)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                id="price_offer"
                name="price_offer"
                value={priceOffer}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`input pl-10 mt-1 w-full ${error ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="0.00"
                required
              />
            </div>
            {error && <p className="mt-1 text-sm text-error">{error}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Enviar Contraproposta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounterOfferModal;