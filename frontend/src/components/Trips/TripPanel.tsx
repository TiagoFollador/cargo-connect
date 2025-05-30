import React, { useState } from 'react';
import TripCard from './TripCard';
import { Trip } from '../../types';
import { mockTrips } from '../../data/mockData';
import AcceptTripModal from '../Modals/AcceptTripModal';
import CounterOfferModal from '../Modals/CounterOfferModal';
import FeedbackToast from '../UI/FeedbackToast';

const TripPanel: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isCounterOfferModalOpen, setIsCounterOfferModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Manipula a ação de aceitar uma viagem
  const handleAcceptTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      setSelectedTrip(trip);
      setIsAcceptModalOpen(true);
    }
  };

  // Manipula a ação de fazer uma contraproposta
  const handleCounterOffer = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      setSelectedTrip(trip);
      setIsCounterOfferModalOpen(true);
    }
  };

  // Confirma a aceitação de uma viagem
  const confirmAcceptTrip = () => {
    if (selectedTrip) {
      // Em uma aplicação real, isso seria uma chamada de API
      setTrips(trips.map(trip => 
        trip.id === selectedTrip.id ? { ...trip, status: 'accepted' } : trip
      ));
      setFeedback({
        message: `Viagem de ${selectedTrip.origin} para ${selectedTrip.destination} aceita com sucesso!`,
        type: 'success'
      });
      setIsAcceptModalOpen(false);
    }
  };

  // Envia uma contraproposta para uma viagem
  const submitCounterOffer = (offeredPrice: number, message: string) => {
    if (selectedTrip) {
      // Em uma aplicação real, isso seria uma chamada de API
      setFeedback({
        message: `Contraproposta de R$${offeredPrice.toFixed(2)} enviada para a viagem de ${selectedTrip.origin} para ${selectedTrip.destination}!`,
        type: 'info'
      });
      setIsCounterOfferModalOpen(false);
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
            onCounterOffer={handleCounterOffer}
          />
        ))}
      </div>

      {/* Modais de interação */}
      <AcceptTripModal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        onConfirm={confirmAcceptTrip}
        trip={selectedTrip}
      />

      <CounterOfferModal
        isOpen={isCounterOfferModalOpen}
        onClose={() => setIsCounterOfferModalOpen(false)}
        onSubmit={submitCounterOffer}
        trip={selectedTrip}
      />

      {/* Toast de feedback para o usuário */}
      {feedback && (
        <FeedbackToast
          message={feedback.message}
          type={feedback.type}
          onClose={() => setFeedback(null)}
        />
      )}
    </div>
  );
};

export default TripPanel;