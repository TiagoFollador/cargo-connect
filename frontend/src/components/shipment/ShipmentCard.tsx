import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Truck, Package, Weight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Shipment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ShipmentCardProps {
  shipment: Shipment;
  variant?: 'default' | 'compact';
}

const ShipmentCard = ({ shipment, variant = 'default' }: ShipmentCardProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = () => {
    if (variant === 'compact') {
      setDetailsOpen(true);
    } else {
      navigate(`/shipments/${shipment.id}`);
    }
  };

  const isOwner = currentUser?.id === shipment.shipperId;
  const isCarrier = currentUser?.id === shipment.carrierId;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <>
      <Card className={cn(
        "transition-all duration-200 hover:shadow-md overflow-hidden border-gray-200",
        variant === 'compact' && "h-full"
      )}>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("capitalize px-2 py-0.5", statusColors[shipment.status])}>
              {shipment.status}
            </Badge>
            <span className="text-sm font-medium">{shipment.title}</span>
          </div>
          <div className="text-lg font-semibold text-blue-600">${shipment.price}</div>
        </div>
        
        <CardContent className={cn("pt-4", variant === 'compact' ? "pb-2" : "pb-4")}>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">From</div>
                <div className="font-medium">{shipment.origin}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">To</div>
                <div className="font-medium">{shipment.destination}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{shipment.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{shipment.weight}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{shipment.cargoType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{shipment.vehicleType}</span>
              </div>
            </div>
            
            {variant !== 'compact' && (
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={isOwner ? shipment.carrierAvatar : shipment.shipperAvatar} />
                    <AvatarFallback>
                      {(isOwner ? shipment.carrierName : shipment.shipperName)?.substring(0, 2) || 'UN'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">
                      {isOwner ? shipment.carrierName || 'No carrier yet' : shipment.shipperName}
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-yellow-500">★</span>
                      <span className="text-xs ml-1">
                        {isOwner 
                          ? shipment.carrierRating?.toFixed(1) || 'N/A' 
                          : shipment.shipperRating?.toFixed(1) || 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium">{shipment.distance}</div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className={cn(
          "border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800 gap-2",
          variant === 'compact' ? "flex-col" : "flex justify-between"
        )}>
          {variant === 'compact' ? (
            <>
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={isOwner ? shipment.carrierAvatar : shipment.shipperAvatar} />
                    <AvatarFallback>
                      {(isOwner ? shipment.carrierName : shipment.shipperName)?.substring(0, 2) || 'UN'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{shipment.distance}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {shipment.date}
                </Badge>
              </div>
              <Button className="w-full" onClick={handleViewDetails}>
                View Details
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleViewDetails}>
                View Details
              </Button>
              {!isOwner && shipment.status === 'pending' && (
                <Button>Contact Shipper</Button>
              )}
              {isOwner && shipment.status === 'pending' && (
                <Button>Edit Shipment</Button>
              )}
              {isCarrier && shipment.status === 'active' && (
                <Button>Update Status</Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>

      {/* Details Dialog for compact variant */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{shipment.title}</DialogTitle>
            <DialogDescription>
              Shipment details for transport #{shipment.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Origin</h4>
                <p className="font-medium">{shipment.origin}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Destination</h4>
                <p className="font-medium">{shipment.destination}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Date</h4>
                <p>{shipment.date}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Weight</h4>
                <p>{shipment.weight}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Distance</h4>
                <p>{shipment.distance}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Cargo Type</h4>
                <p>{shipment.cargoType}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Vehicle Type</h4>
                <p>{shipment.vehicleType}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Price</h4>
              <p className="text-lg font-semibold text-blue-600">${shipment.price}</p>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                {isOwner ? 'Carrier' : 'Shipper'} Information
              </h4>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={isOwner ? shipment.carrierAvatar : shipment.shipperAvatar} />
                  <AvatarFallback>
                    {(isOwner ? shipment.carrierName : shipment.shipperName)?.substring(0, 2) || 'UN'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {isOwner ? shipment.carrierName || 'No carrier yet' : shipment.shipperName}
                  </p>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm ml-1">
                      {isOwner 
                        ? shipment.carrierRating?.toFixed(1) || 'N/A' 
                        : shipment.shipperRating?.toFixed(1) || 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            {!isOwner && shipment.status === 'pending' && (
              <Button>Contact Shipper</Button>
            )}
            {isOwner && shipment.status === 'pending' && (
              <Button>Edit Shipment</Button>
            )}
            {isCarrier && shipment.status === 'active' && (
              <Button>Update Status</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShipmentCard;