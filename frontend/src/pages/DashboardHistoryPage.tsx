import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getShipmentsByUserId } from '@/lib/data';
import { Shipment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShipmentsTable from '@/components/dashboard/ShipmentsTable';

const DashboardHistoryPage = () => {
  const { currentUser } = useAuth();
  const [completedShipments, setCompletedShipments] = useState<Shipment[]>([]);
  const [cancelledShipments, setCancelledShipments] = useState<Shipment[]>([]);
  
  useEffect(() => {
    if (currentUser) {
      const shipments = getShipmentsByUserId(currentUser.id, currentUser.role);
      setCompletedShipments(shipments.filter(s => s.status === 'completed'));
      setCancelledShipments(shipments.filter(s => s.status === 'cancelled'));
    }
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Histórico</h1>
        <p className="text-muted-foreground">
          Visualize seus {currentUser?.role === 'shipper' ? 'envios' : 'transportes'} anteriores.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Envios</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="completed">
            <TabsList className="mb-4 gap-2">
              <TabsTrigger value="completed">Concluídos ({completedShipments.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelados ({cancelledShipments.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="completed">
              <ShipmentsTable 
                shipments={completedShipments}
                emptyMessage="Nenhum envio concluído encontrado" 
              />
            </TabsContent>
            
            <TabsContent value="cancelled">
              <ShipmentsTable 
                shipments={cancelledShipments}
                emptyMessage="Nenhum envio cancelado encontrado" 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHistoryPage;
