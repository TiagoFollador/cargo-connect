import React, { useState } from 'react';
import TripCard from './TripCard';
import { Trip } from '../../types';
import { mockTrips } from '../../data/mockData';

const TripPanel: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);

  // Manipula a ação de aceitar uma viagem
  const handleAcceptTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      setTrips(trips.map(trip => 
        trip.id === tripId ? { ...trip, status: 'accepted' } : trip
      ));
    }
  };

  return (
    <div className="space-y-6">
      {/* Grid de cards de viagens */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onAccept={handleAcceptTrip}
          />
        ))}
      </div>
    </div>
  );
};

export default TripPanel;