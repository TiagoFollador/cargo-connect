import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  DollarSign,
  TruckIcon,
  Package,
  Eye,
} from "lucide-react";
import TripModal from "../Modals/TripModal";

interface TripCardProps {
  trip: any;
  onAccept: (tripId: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onAccept }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pickupDate = trip.pickup_date || trip.date;
  const price = trip.price_offer || trip.price || 0;
  const origin = trip.pickup_location || trip.origin || "Origem não informada";
  const destination =
    trip.delivery_location || trip.destination || "Destino não informado";
  const title = trip.title || `${origin} → ${destination}`;
  const weight = trip.weight_kg
    ? `${trip.weight_kg}kg`
    : trip.weight || "Não informado";
  const status = trip.status === "pending" ? "available" : trip.status;

  const formattedDate = pickupDate
    ? new Date(pickupDate).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Data não informada";

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  return (
    <div className="card group hover:shadow-md overflow-hidden slide-up">
      <div className="absolute right-4 top-4 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-primary shadow-sm">
        {status === "available" ? "Disponível" : "Aceito"}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-text-secondary">
            <Calendar size={14} className="mr-1" />
            {formattedDate}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-start space-x-2">
          <MapPin size={18} className="mt-0.5 flex-shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium">De: {origin}</p>
            <p className="text-sm font-medium">Para: {destination}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Package size={18} className="flex-shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium">
              {trip.description || "Carga geral"}
            </p>
            <p className="text-xs text-text-secondary">Peso: {weight}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <DollarSign size={18} className="flex-shrink-0 text-primary" />
          <p className="text-lg font-semibold">{formattedPrice}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-secondary flex-1"
        >
          <Eye size={16} className="mr-2" />
          Ver Detalhes
        </button>

        {status === "available" && (
          <button
            onClick={() => onAccept(trip.id)}
            className="btn btn-primary flex-1"
          >
            Aceitar
          </button>
        )}
      </div>

      {status === "accepted" && (
        <div className="mt-2">
          <button
            disabled
            className="btn w-full bg-success/20 text-success cursor-not-allowed"
          >
            <TruckIcon size={16} className="mr-2" />
            Viagem Aceita
          </button>
        </div>
      )}

      <TripModal
        trip={trip}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={status === "available" ? onAccept : undefined}
      />
    </div>
  );
};

export default TripCard;
