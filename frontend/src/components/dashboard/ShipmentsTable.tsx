import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shipment } from '@/lib/types';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShipmentsTableProps {
  shipments: Shipment[];
  emptyMessage?: string;
}

const ShipmentsTable = ({ shipments, emptyMessage = "Nenhum envio encontrado" }: ShipmentsTableProps) => {
  const navigate = useNavigate();

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const handleViewDetails = (id: string) => {
    navigate(`/shipments/${id}`);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Rota</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">{shipment.id}</TableCell>
                <TableCell>{shipment.date}</TableCell>
                <TableCell>
                  <div className="font-medium">{shipment.origin}</div>
                  <div className="text-sm text-gray-500">para {shipment.destination}</div>
                </TableCell>
                <TableCell className="font-medium">R${shipment.price}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusColors[shipment.status])}>
                    {shipment.status === 'pending' ? 'pendente' : 
                     shipment.status === 'active' ? 'ativo' : 
                     shipment.status === 'completed' ? 'concluído' : 
                     shipment.status === 'cancelled' ? 'cancelado' : shipment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(shipment.id)}
                    className="h-8 w-8 p-0 bg-gray-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShipmentsTable;
