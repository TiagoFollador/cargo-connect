import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getShipmentsByUserId } from '@/lib/data';
import { Shipment } from '@/lib/types';
import ShipmentCard from '@/components/shipment/ShipmentCard';

const DashboardPendingPage = () => {
  const { currentUser } = useAuth();
  const [pendingShipments, setPendingShipments] = useState<Shipment[]>([]);
  
  useEffect(() => {
    if (currentUser) {
      const shipments = getShipmentsByUserId(currentUser.id, currentUser.role);
      setPendingShipments(shipments.filter(s => s.status === 'pending'));
    }
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ofertas Pendentes</h1>
        <p className="text-muted-foreground">
          {currentUser?.role === 'shipper' 
            ? 'Suas solicitações de envio pendentes aguardando ofertas de transportadores.' 
            : 'Envios disponíveis para você fazer ofertas.'}
        </p>
      </div>

      {pendingShipments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Você não tem ofertas pendentes no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingShipments.map(shipment => (
            <ShipmentCard key={shipment.id} shipment={shipment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPendingPage;
