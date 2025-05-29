import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShipmentFilter from '../shipment/ShipmentFilter';
import ShipmentCard from '../shipment/ShipmentCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShipmentFilters, Shipment } from '@/lib/types';
import { mockShipments } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

const SearchSection = () => {
  const navigate = useNavigate();
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setFilteredShipments(
      mockShipments.filter(shipment => shipment.status === 'pending').slice(0, 3)
    );
  }, []);

  const handleFilter = (filters: ShipmentFilters) => {
    let results = [...mockShipments];
    
    if (filters.origin) {
      results = results.filter(s => 
        s.origin.toLowerCase().includes(filters.origin!.toLowerCase())
      );
    }
    
    if (filters.destination) {
      results = results.filter(s => 
        s.destination.toLowerCase().includes(filters.destination!.toLowerCase())
      );
    }
    
    if (filters.cargoType) {
      results = results.filter(s => s.cargoType === filters.cargoType);
    }
    
    if (filters.vehicleType) {
      results = results.filter(s => s.vehicleType === filters.vehicleType);
    }
    
    if (filters.minPrice) {
      results = results.filter(s => s.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice) {
      results = results.filter(s => s.price <= filters.maxPrice!);
    }
    
    setFilteredShipments(showAll ? results : results.slice(0, 3));
  };

  const handleViewAll = () => {
    navigate('/shipments');
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setFilteredShipments(mockShipments.filter(shipment => shipment.status === 'pending'));
    } else {
      setFilteredShipments(mockShipments.filter(shipment => shipment.status === 'pending').slice(0, 3));
    }
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Encontre seu próximo transporte</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Procure por milhares de fretes disponíveis ou publique seu próprio cargo para transporte.
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-0 mb-2">
            <CardTitle className="text-xl ">Filtros de pesquisa</CardTitle>
          </CardHeader>
          <CardContent>
            <ShipmentFilter onFilter={handleFilter} />
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-6">Fretes disponíveis</h3>
          
          {filteredShipments.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-gray-500 dark:text-gray-400">Nenhum frete encontrado com os critérios especificados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShipments.map(shipment => (
                <ShipmentCard key={shipment.id} shipment={shipment} />
              ))}
            </div>
          )}
          
          <div className="flex justify-center mt-8 gap-4">
            <Button variant="outline" onClick={toggleShowAll}>
              {showAll ? "Mostrar menos" : "Mostrar mais"}
            </Button>
            <Button onClick={handleViewAll} className="group">
              Ver todos os fretes
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
