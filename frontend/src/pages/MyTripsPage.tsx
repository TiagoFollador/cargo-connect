import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { shipmentService } from "../services/shipmentService";
import TripModal from "../components/Modals/TripModal";
import EditTripModal from "../components/Modals/EditTripModal";

const MyTripsPage: React.FC = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadMyTrips();
    }
  }, [user]);

  const loadMyTrips = async () => {
    try {
      setIsLoading(true);
      setError("");
      const allTrips = await shipmentService.getAllShipments();
      const myTrips = allTrips.filter((trip) => trip.user_id === user?.id);
      setTrips(myTrips);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar suas viagens");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta viagem?")) {
      return;
    }

    try {
      await shipmentService.deleteShipment(tripId);
      setTrips(trips.filter((trip) => trip.id !== tripId));
    } catch (err: any) {
      alert("Erro ao excluir viagem: " + (err.message || "Erro desconhecido"));
    }
  };

  const handleEditTrip = (trip: any) => {
    setSelectedTrip(trip);
    setIsEditModalOpen(true);
  };

  const handleViewTrip = (trip: any) => {
    setSelectedTrip(trip);
    setIsViewModalOpen(true);
  };

  const handleTripUpdated = () => {
    loadMyTrips();
    setIsEditModalOpen(false);
    setSelectedTrip(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: "Pendente",
      active: "Ativa",
      in_transit: "Em Trânsito",
      delivered: "Entregue",
      cancelled: "Cancelada",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-blue-100 text-blue-800",
      in_transit: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      colorMap[status as keyof typeof colorMap] || "bg-gray-100 text-gray-800"
    );
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
          <button onClick={loadMyTrips} className="btn btn-primary">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Minhas Viagens
          </h1>
          <p className="text-text-secondary">
            Gerencie suas viagens cadastradas
          </p>
        </div>
        <a href="/create-trip" className="btn btn-primary">
          <Plus size={20} className="mr-2" />
          Nova Viagem
        </a>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg mb-4">
            Você ainda não cadastrou nenhuma viagem
          </p>
          <a href="/create-trip" className="btn btn-primary">
            <Plus size={20} className="mr-2" />
            Cadastrar Primeira Viagem
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {trip.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}
                  >
                    {getStatusText(trip.status)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewTrip(trip)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye size={18} />
                  </button>
                  {trip.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleEditTrip(trip)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-text-secondary">De:</p>
                  <p className="font-medium">{trip.pickup_location}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Para:</p>
                  <p className="font-medium">{trip.delivery_location}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Valor:</p>
                  <p className="font-medium text-primary">
                    {trip.price_offer
                      ? formatPrice(trip.price_offer)
                      : "A negociar"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-text-secondary">Coleta:</p>
                  <p className="font-medium">{formatDate(trip.pickup_date)}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Entrega:</p>
                  <p className="font-medium">
                    {formatDate(trip.delivery_date)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTrip && (
        <>
          <TripModal
            trip={selectedTrip}
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedTrip(null);
            }}
          />
          <EditTripModal
            trip={selectedTrip}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTrip(null);
            }}
            onSave={handleTripUpdated}
          />
        </>
      )}
    </div>
  );
};

export default MyTripsPage;
