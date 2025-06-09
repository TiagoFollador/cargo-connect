import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { dashboardService } from "../services/dashboardService";
import DashboardStats from "../components/Dashboard/DashboardStats";
import ActiveTrips from "../components/Dashboard/ActiveTrips";
import VehicleStatus from "../components/Dashboard/VehicleStatus";

const DashboardPage: React.FC = () => {
  const { user, isCarrier, isShipper } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        let data;

        if (isCarrier()) {
          data = await dashboardService.getCarrierSummary();
        } else if (isShipper()) {
          data = await dashboardService.getShipperSummary();
        }

        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados do dashboard");
        console.error("Erro no dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, isCarrier, isShipper]);

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
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary mt-4"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {isCarrier() ? "Painel do Transportador" : "Painel do Embarcador"}
          </h1>
          <p className="mt-2 text-text-secondary">
            {isCarrier()
              ? "Gerencie sua frota e acompanhe entregas"
              : "Gerencie seus embarques e acompanhe transportes"}
          </p>
        </div>
        <Link
          to="/create-trip"
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>
            {isCarrier() ? "Adicionar Veículo" : "Adicionar Nova Viagem"}
          </span>
        </Link>
      </div>

      <div className="space-y-8">
        {dashboardData ? (
          <>
            <DashboardStats stats={dashboardData} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <ActiveTrips
                trips={
                  dashboardData.recent_trips ||
                  dashboardData.recent_shipments ||
                  []
                }
              />
              <VehicleStatus vehicles={dashboardData.vehicle_status || []} />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary">
              Nenhum dado disponível no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
