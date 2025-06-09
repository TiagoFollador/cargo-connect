import React from "react";
import { Truck } from "lucide-react";

interface VehicleStatusProps {
  vehicles: any[];
}

const VehicleStatus: React.FC<VehicleStatusProps> = ({ vehicles = [] }) => {
  const getStatusColor = (status: string | boolean) => {
    if (typeof status === "boolean") {
      status = status ? "active" : "inactive";
    }

    switch (status) {
      case "active":
      case true:
        return "bg-green-100 text-green-800";
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      case "inactive":
      case false:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string | boolean) => {
    if (typeof status === "boolean") {
      status = status ? "active" : "inactive";
    }

    switch (status) {
      case "active":
      case true:
        return "Ativo";
      case "in_transit":
        return "Em Trânsito";
      case "maintenance":
        return "Manutenção";
      case "inactive":
      case false:
        return "Inativo";
      default:
        return status?.toString() || "Desconhecido";
    }
  };

  return (
    <div className="card">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">
          Status dos Veículos
        </h2>
      </div>

      <div className="space-y-4">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle, index) => (
            <div
              key={vehicle.id || index}
              className="flex items-center justify-between border-b border-border pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-gray-50 p-2">
                  <Truck className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">
                    {vehicle.plate ||
                      vehicle.license_plate ||
                      `${vehicle.make} ${vehicle.model}` ||
                      "Veículo"}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {vehicle.location ||
                      (vehicle.year ? `Ano: ${vehicle.year}` : "") ||
                      (vehicle.capacity_kg
                        ? `Capacidade: ${vehicle.capacity_kg}kg`
                        : "") ||
                      "Localização não informada"}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(vehicle.status || vehicle.is_active)}`}
              >
                {getStatusText(vehicle.status || vehicle.is_active)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-text-secondary">
            <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum veículo encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleStatus;
