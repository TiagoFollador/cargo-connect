import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getShipmentsByUserId } from '@/lib/data';
import { Shipment } from '@/lib/types';
import ShipmentCard from '@/components/shipment/ShipmentCard';

const DashboardActivePage = () => {
  const { currentUser } = useAuth();
  const [activeShipments, setActiveShipments] = useState<Shipment[]>([]);
  
  useEffect(() => {
    if (currentUser) {
      const shipments = getShipmentsByUserId(currentUser.id, currentUser.role);
      setActiveShipments(shipments.filter(s => s.status === 'active'));
    }
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {currentUser?.role === 'shipper' ? 'Envios Ativos' : 'Transportes Ativos'}
        </h1>
        <p className="text-muted-foreground">
          Gerencie seus {currentUser?.role === 'shipper' ? 'envios ativos' : 'transportes em andamento'}.
        </p>
      </div>

      {activeShipments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Você não tem {currentUser?.role === 'shipper' ? 'envios' : 'transportes'} ativos no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeShipments.map(shipment => (
            <ShipmentCard key={shipment.id} shipment={shipment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardActivePage;
