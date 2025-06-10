const express = require('express');
const router = express.Router();
const shipmentOfferRepository = require('./ShipmentOfferRepository');

router.post('/', shipmentOfferRepository.createShipmentOffer);

router.get('/', shipmentOfferRepository.getAllShipmentOffers);

router.get('/:id', shipmentOfferRepository.getShipmentOfferById);

router.get('/shipment/:shipmentId', shipmentOfferRepository.getOffersByShipmentId);

router.get('/user/:userId', shipmentOfferRepository.getOffersByUserId);

router.put('/:id', shipmentOfferRepository.updateShipmentOffer);

router.put('/status/:id', shipmentOfferRepository.updateOfferStatus);

router.delete('/:id', shipmentOfferRepository.deleteShipmentOffer);

module.exports = router;