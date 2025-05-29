import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/dashboard/StatsCard';
import ShipmentsTable from '@/components/dashboard/ShipmentsTable';
import { useAuth } from '@/context/AuthContext';
import { getShipmentsByUserId, mockDashboardStats } from '@/lib/data';
import { Shipment, DashboardStats } from '@/lib/types';
import { TruckIcon, Package, ShoppingCart, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userShipments, setUserShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  useEffect(() => {
    if (currentUser) {
      // Get user shipments
      const shipments = getShipmentsByUserId(currentUser.id, currentUser.role);
      setUserShipments(shipments);
      
      // Get user stats
      const userStats = mockDashboardStats[currentUser.id];
      if (userStats) {
        setStats(userStats);
      }
    }
  }, [currentUser]);

  // Mock data for chart
  const chartData = [
    { name: 'Jan', value: 2400 },
    { name: 'Fev', value: 1398 },
    { name: 'Mar', value: 9800 },
    { name: 'Abr', value: 3908 },
    { name: 'Mai', value: 4800 },
    { name: 'Jun', value: 3800 },
    { name: 'Jul', value: 4300 },
  ];

  if (!currentUser || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center my-16">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Carregando...</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Preparando seu painel
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta, {currentUser.name}! Aqui está uma visão geral dos seus {currentUser.role === 'shipper' ? 'envios' : 'transportes'}.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Envios Ativos"
          value={stats.activeShipments}
          icon={<Package className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Envios Concluídos"
          value={stats.completedShipments}
          icon={<TruckIcon className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Ofertas Pendentes"
          value={stats.pendingOffers}
          icon={<ShoppingCart className="h-5 w-5" />}
          trend={{ value: 5, isPositive: false }}
        />
        {currentUser.role === 'carrier' && stats.totalRevenue && (
          <StatsCard
            title="Receita Total"
            value={`R$${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: 10, isPositive: true }}
          />
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {currentUser.role === 'shipper' ? 'Envios Mensais' : 'Receita Mensal'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center border-b pb-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Nova solicitação de envio</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    De São Paulo para Rio de Janeiro
                  </p>
                </div>
                <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  2 horas atrás
                </div>
              </div>

              <div className="flex items-center border-b pb-3">
                <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Pagamento recebido</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Para envio #ship-3
                  </p>
                </div>
                <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  Ontem
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-3">
                  <TruckIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Status de envio atualizado</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Envio #ship-4 está em trânsito
                  </p>
                </div>
                <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  2 dias atrás
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Shipments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Envios Recentes</h2>
        <ShipmentsTable
          shipments={userShipments.slice(0, 5)}
          emptyMessage={`Nenhum ${currentUser.role === 'shipper' ? 'envio' : 'transporte'} encontrado`}
        />
      </div>
    </div>
  );
};

export default Dashboard;
