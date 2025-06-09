import React, { useState, useEffect } from "react";
import { shipmentService } from "../../services/shipmentService";
import SearchField from "./components/SearchField";
import { Trip } from "./type";
import { TripCard } from "./components/TripCard";

const SearchTripsPage = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await shipmentService.getAllShipments();
      setTrips(data);
      setFilteredTrips(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar viagens");
      setTrips([]);
      setFilteredTrips([]);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Erro ao Carregar Viagens
          </h1>
          <p className="text-text-secondary mb-6">{error}</p>
          <button onClick={loadTrips} className="btn btn-primary">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Buscar Viagens
        </h1>
        <p className="text-text-secondary">
          Encontre as melhores oportunidades de transporte
        </p>
      </div>

      <SearchField trips={trips} setFilteredTrips={setFilteredTrips} />

      <div className="mt-8">
        {filteredTrips.length > 0 ? (
          <div className="grid gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onAccept={() => {
                  console.log("Aceitar viagem:", trip.id);
                }}
                onCounterOffer={() => {
                  console.log("Contra-oferta para viagem:", trip.id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">
              {trips.length === 0
                ? "Nenhuma viagem disponível no momento"
                : "Nenhuma viagem encontrada com os filtros aplicados"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTripsPage;
