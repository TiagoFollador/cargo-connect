import React, { useState } from 'react';
import { 
  Autocomplete,
  TextField,
  Button,
  Slider,
  Box,
  Typography
} from '@mui/material';



type TripStatus = 'pending' | 'active' | 'in_transit' | 'delivered' | 'cancelled';

type Trip = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  cargo_type_id: number;
  weight_kg: number;
  volume_m3: number | null;
  pickup_location: string;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  pickup_date: string;
  delivery_location: string;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  delivery_date: string;
  required_vehicle_type_id: number | null;
  price_offer: number | null;
  status: TripStatus;
  created_at: string;
  updated_at: string;
};

interface CargoType {
  id?: number;
  name: string;
  description?: string;
  requires_special_handling?: boolean;
}

interface VehicleType {
  id?: number;
  name: string;
  description?: string;
  capacity_kg?: number;
}

interface SearchFiltersProps {
  trips: Trip[];
  setFilteredTrips: (filterData: Trip[]) => void;
}

const SearchFilters = ({ trips, setFilteredTrips }: SearchFiltersProps) => {
  const [cargoType, setCargoType] = useState<CargoType | null>(null);
  const [origin, setOrigin] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 10000]);

  const cargoTypes: CargoType[] = [
    { id: 1, name: 'Animais' },
    { id: 2, name: 'Material de Construção' },
    { id: 3, name: 'Comida' },
    { id: 4, name: 'Grãos' },
    { id: 5, name: 'Móveis' },
    { id: 6, name: 'Eletrônicos' },
  ];

  const vehicleTypes: VehicleType[] = [
    { id: 1, name: 'Caminhão Baú' },
    { id: 2, name: 'Carreta' },
    { id: 3, name: 'Caminhão Aberto' },
    { id: 4, name: 'Caminhão Frigorífico' },
    { id: 5, name: 'Van' },
  ];

  const origins = Array.from(new Set(trips.map(trip => trip.pickup_location)));
  const destinations = Array.from(new Set(trips.map(trip => trip.delivery_location)));

  const handleSearch = () => {
    const filtered = trips.filter(trip => {
      return (
        (!cargoType || trip.cargo_type_id === cargoType.id) &&
        (!origin || trip.pickup_location === origin) &&
        (!destination || trip.delivery_location === destination) &&
        (!vehicleType || trip.required_vehicle_type_id === vehicleType.id) &&
        (trip.price_offer ? trip.price_offer : 0) >= budgetRange[0] &&
        (trip.price_offer ? trip.price_offer : 0) <= budgetRange[1]
      );
    });
    setFilteredTrips(filtered);
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <Autocomplete
            options={cargoTypes}
            getOptionLabel={(option) => option.name}
            value={cargoType}
            onChange={(_, newValue) => setCargoType(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Tipo de Carga" variant="outlined" />
            )}
            fullWidth
          />
          <Autocomplete
            options={vehicleTypes}
            getOptionLabel={(option) => option.name}
            value={vehicleType}
            onChange={(_, newValue) => setVehicleType(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Tipo de Veículo" variant="outlined" />
            )}
            fullWidth
          />

          <Autocomplete
            options={origins}
            value={origin}
            onChange={(_, newValue) => setOrigin(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Origem" variant="outlined" />
            )}
            fullWidth
          />
           

          <Autocomplete
            options={destinations}
            value={destination}
            onChange={(_, newValue) => setDestination(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Destino" variant="outlined" />
            )}
            fullWidth
          />

         


          
        </div>
        <div className=' flex flex-col flex-grow'>
    
          <Typography gutterBottom>
            Orçamento: R${budgetRange[0]} - R${budgetRange[1]}
          </Typography>
          <Slider
            value={budgetRange}
            onChange={(_, newValue) => setBudgetRange(newValue as [number, number])}
            valueLabelDisplay="auto"
            min={0}
            max={20000}
            step={100}
          />
</div>
        <div className='flex justify-center'>

<Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            size="large"
            sx={{ px: 5 }}
          >
            Pesquisar
          </Button>
        </div>
    </Box>
  );
};

export default SearchFilters;