import React from "react";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface ActiveTripsProps {
  trips: any[];
}

const ActiveTrips: React.FC<ActiveTripsProps> = ({ trips = [] }) => {
  return (
    <div className="card">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">
          Viagens Ativas
        </h2>
      </div>

      <div className="space-y-4">
        {trips.length > 0 ? (
          trips.map((trip, index) => (
            <div
              key={trip.id || trip.shipmentId || index}
              className="flex items-center justify-between border-b border-border pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-blue-50 p-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">
                    {trip.title ||
                      trip.shipmentTitle ||
                      `${trip.origin || trip.pickup_location} → ${trip.destination || trip.delivery_location}`}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {trip.date ||
                          trip.pickupDate ||
                          trip.pickup_date ||
                          "Data não informada"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>
                        R${" "}
                        {(
                          trip.price ||
                          trip.priceOffer ||
                          trip.price_offer ||
                          trip.agreedPrice ||
                          0
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                {trip.status === "in_transit"
                  ? "Em Trânsito"
                  : trip.status === "active"
                    ? "Ativo"
                    : trip.contractStatus === "active"
                      ? "Em Andamento"
                      : "Ativo"}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-text-secondary">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma viagem ativa encontrada</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/trips"
          className="text-sm font-medium text-primary hover:text-primary-light"
        >
          Ver Todas as Viagens
        </Link>
      </div>
    </div>
  );
};

export default ActiveTrips;
