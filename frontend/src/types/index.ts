
export type UserRole = 'conductor' | 'transporter';


export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  rating: number;
  company?: string;
  verified: boolean;
}


export interface Trip {
  id: string;
  origin: string;
  destination: string;
  date: string;
  price: number;
  distance: string;
  weight: string;
  cargo: string;
  status: 'available' | 'accepted' | 'in_progress' | 'completed' | 'counterOffer';
  createdAt: string;
  transporterId?: string;
  conductorId?: string;
}


export interface CounterOffer {
  tripId: string;
  originalPrice: number;
  offeredPrice: number;
  message?: string;
}


export interface Vehicle {
  id: string;
  type: string;
  plate: string;
  capacity: string;
  year: number;
  status: 'active' | 'in_transit' | 'maintenance';
  location?: string;
}

export interface DashboardStats {
  revenue: number;
  activeVehicles: number;
  rating: number;
  completedTrips: number;
}

export interface ActiveTrip {
  id: string;
  route: string;
  date: string;
  price: number;
  status: 'in_progress';
}

export interface CargoType {
  id: number;
  name: string;
  description?: string;
  requires_special_handling?: boolean;
}

export interface VehicleType {
  id: number;
  name: string;
  description?: string;
  capacity_kg?: number;
}

export interface CreateTripForm {
  title: string;
  description?: string;
  cargo_type_id: number;
  weight_kg: number;
  volume_m3?: number;
  pickup_location: string;
  pickup_date: string;
  delivery_location: string;
  delivery_date: string;
  required_vehicle_type_id?: number;
  price_offer?: number;
}