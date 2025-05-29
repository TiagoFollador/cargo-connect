import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ShipmentFilters, CargoType, VehicleType } from '@/lib/types';
import { SearchIcon, FilterX } from 'lucide-react';

interface ShipmentFilterProps {
  onFilter: (filters: ShipmentFilters) => void;
  className?: string;
}

const ShipmentFilter = ({ onFilter, className }: ShipmentFilterProps) => {
  const [filters, setFilters] = useState<ShipmentFilters>({});
  
  const handleChange = (name: keyof ShipmentFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const applyFilters = () => {
    onFilter(filters);
  };
  
  const resetFilters = () => {
    setFilters({});
    onFilter({});
  };

  const cargoTypes: CargoType[] = ['Geral', 'Refrigerado', 'Perigoso', 'Líquido', 'Pesado'];
  const vehicleTypes: VehicleType[] = ['Van', 'Caminhão', 'Semi-Reboque', 'Caminhão Refrigerado', 'Tanque'];
  
  return (
    <Card className={className}>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Origem
            </label>
            <Input
              id="origin"
              placeholder="Cidade de origem"
              value={filters.origin || ''}
              onChange={(e) => handleChange('origin', e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Destino
            </label>
            <Input
              id="destination"
              placeholder="Cidade de destino"
              value={filters.destination || ''}
              onChange={(e) => handleChange('destination', e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="cargoType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Carga
            </label>
            <Select 
              value={filters.cargoType} 
              onValueChange={(value) => handleChange('cargoType', value as CargoType)}
            >
              <SelectTrigger id="cargoType">
                <SelectValue placeholder="Qualquer tipo de carga" />
              </SelectTrigger>
              <SelectContent>
                {cargoTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Veículo
            </label>
            <Select 
              value={filters.vehicleType} 
              onValueChange={(value) => handleChange('vehicleType', value as VehicleType)}
            >
              <SelectTrigger id="vehicleType">
                <SelectValue placeholder="Qualquer tipo de veículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preço Mínimo ($)
            </label>
            <Input
              id="minPrice"
              type="number"
              placeholder="Preço mínimo"
              value={filters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', Number(e.target.value) || undefined)}
            />
          </div>
          
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preço Máximo ($)
            </label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="Preço máximo"
              value={filters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', Number(e.target.value) || undefined)}
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data
            </label>
            <Input
              id="date"
              type="date"
              value={filters.date ? new Date(filters.date).toISOString().split('T')[0] : ''}
              onChange={(e) => handleChange('date', e.target.value ? new Date(e.target.value) : undefined)}
            />
          </div>
        </div>
        
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={resetFilters} className="flex items-center gap-1">
            <FilterX className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={applyFilters} className="flex items-center gap-1">
            <SearchIcon className="h-4 w-4" />
            Buscar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentFilter;
