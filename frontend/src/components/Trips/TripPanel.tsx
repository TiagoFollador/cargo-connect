import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import TripCardSimple from "./TripCardSimple";
import TripModal from "../Modals/TripModal";
import { shipmentService } from "../../services/shipmentService";

const TripPanel: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await shipmentService.getAllShipments();
      setTrips(data.slice(0, 6));
    } catch (err: any) {
      setError(err.message || "Erro ao carregar viagens");
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTrip = (tripId: string) => {
    console.log("Aceitar viagem:", tripId);
  };

  const handleViewTrip = (trip: any) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={loadTrips} className="btn btn-primary">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCardSimple
              key={trip.id}
              trip={trip}
              onAccept={handleAcceptTrip}
              onViewDetails={handleViewTrip}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Nenhuma viagem disponível
          </h3>
          <p className="text-text-secondary">
            Não há viagens disponíveis no momento. Tente novamente mais tarde.
          </p>
        </div>
      )}

      <TripModal
        trip={selectedTrip}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAccept={handleAcceptTrip}
      />
    </div>
  );
};

export default TripPanel;
