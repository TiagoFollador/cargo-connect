const express = require('express');
const router = express.Router();
const shipmentOfferRepository = require('./ShipmentOfferRepository');

// Create a new shipment offer
router.post('/', shipmentOfferRepository.createShipmentOffer);

// Get all shipment offers (with search/filter capabilities)
router.get('/', shipmentOfferRepository.getAllShipmentOffers);

// Get a single shipment offer by ID
router.get('/:id', shipmentOfferRepository.getShipmentOfferById);

// Get all offers for a specific shipment
router.get('/shipment/:shipmentId', shipmentOfferRepository.getOffersByShipmentId);

// Get all offers made by a specific user
router.get('/user/:userId', shipmentOfferRepository.getOffersByUserId);

// Update a shipment offer by ID
router.put('/:id', shipmentOfferRepository.updateShipmentOffer);

// Delete a shipment offer by ID
router.delete('/:id', shipmentOfferRepository.deleteShipmentOffer);

module.exports = router;