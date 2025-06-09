import React from "react";
import {
  DollarSign,
  Truck,
  Star,
  CheckCircle,
  Package,
  Clock,
} from "lucide-react";

interface DashboardStatsProps {
  stats: any;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const getStatCards = () => {
    if (stats.activeServices !== undefined) {
      return [
        {
          title: "Serviços Ativos",
          value: (stats.activeServices || 0).toString(),
          icon: Truck,
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
          borderColor: "border-l-blue-500",
        },
        {
          title: "Ofertas Pendentes",
          value: (stats.pendingOffersMade || 0).toString(),
          icon: Clock,
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600",
          borderColor: "border-l-orange-500",
        },
        {
          title: "Serviços Concluídos",
          value: (stats.completedServices || 0).toString(),
          icon: CheckCircle,
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          borderColor: "border-l-green-500",
        },
        {
          title: "Receita Total",
          value: `R$ ${(stats.total_revenue || 0).toLocaleString()}`,
          icon: DollarSign,
          bgColor: "bg-yellow-50",
          iconColor: "text-yellow-600",
          borderColor: "border-l-yellow-500",
        },
      ];
    }

    if (stats.activeTransports !== undefined) {
      return [
        {
          title: "Transportes Ativos",
          value: (stats.activeTransports || 0).toString(),
          icon: Truck,
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
          borderColor: "border-l-blue-500",
        },
        {
          title: "Ofertas Pendentes",
          value: (stats.pendingOffers || 0).toString(),
          icon: Clock,
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600",
          borderColor: "border-l-orange-500",
        },
        {
          title: "Transportes Concluídos",
          value: (stats.completedTransports || 0).toString(),
          icon: CheckCircle,
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          borderColor: "border-l-green-500",
        },
        {
          title: "Total Gasto",
          value: `R$ ${(stats.total_spent || 0).toLocaleString()}`,
          icon: DollarSign,
          bgColor: "bg-yellow-50",
          iconColor: "text-yellow-600",
          borderColor: "border-l-yellow-500",
        },
      ];
    }

    return [
      {
        title: "Receita",
        value: `R$ ${(stats.revenue || 0).toLocaleString()}`,
        icon: DollarSign,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        borderColor: "border-l-blue-500",
      },
      {
        title: "Veículos Ativos",
        value: (stats.activeVehicles || 0).toString(),
        icon: Truck,
        bgColor: "bg-orange-50",
        iconColor: "text-orange-600",
        borderColor: "border-l-orange-500",
      },
      {
        title: "Avaliação",
        value: (stats.rating || 0).toString(),
        icon: Star,
        bgColor: "bg-green-50",
        iconColor: "text-green-600",
        borderColor: "border-l-green-500",
      },
      {
        title: "Viagens Concluídas",
        value: (stats.completedTrips || 0).toString(),
        icon: CheckCircle,
        bgColor: "bg-yellow-50",
        iconColor: "text-yellow-600",
        borderColor: "border-l-yellow-500",
      },
    ];
  };

  const statCards = getStatCards();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <div key={index} className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {card.value}
              </p>
            </div>
            <div className={`rounded-full p-3 ${card.bgColor}`}>
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
