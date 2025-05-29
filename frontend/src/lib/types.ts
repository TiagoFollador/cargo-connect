export type Role = 'shipper' | 'carrier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  rating: number;
  transportCount: number;
  notificationCount: number;
}

export interface Shipment {
  id: string;
  title: string;
  origin: string;
  destination: string;
  price: number;
  distance: string;
  cargoType: string;
  vehicleType: string;
  weight: string;
  status: string;
  date: string;
  carrierId?: string;
  carrierName?: string;
  carrierAvatar?: string;
  carrierRating?: number;
  shipperId?: string;
  shipperName?: string;
  shipperAvatar?: string;
  shipperRating?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  rating: number;
  text: string;
  company?: string;
}

export type CargoType = {
  id: number;
  name: string;
  description: string;
  requires_special_handling: number;
};
export type VehicleType = {
  id: number;
  name: string;
  description: string;
  capacity_kg: number;
};

export interface ShipmentFilters {
  origin?: string;
  destination?: string;
  cargoType?: CargoType;
  vehicleType?: VehicleType;
  minPrice?: number;
  maxPrice?: number;
  date?: Date;
}

export interface DashboardStats {
  completedShipments: number;
  activeShipments: number;
  pendingOffers: number;
  totalRevenue?: number;
  monthlyRevenue?: number;
}
