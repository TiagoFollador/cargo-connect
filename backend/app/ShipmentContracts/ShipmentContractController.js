const express = require('express');
const router = express.Router();
const contractRepository = require('./ShipmentContractRepository');

// Create a new shipment contract
router.post('/', contractRepository.createShipmentContract);

// Get all shipment contracts (with search/filter capabilities)
router.get('/', contractRepository.getAllShipmentContracts);

// Get a single shipment contract by ID
router.get('/:id', contractRepository.getShipmentContractById);

// Get a shipment contract by shipment_id
router.get('/shipment/:shipmentId', contractRepository.getContractByShipmentId);

// Update a shipment contract by ID
router.put('/:id', contractRepository.updateShipmentContract);

// Delete a shipment contract by ID
router.delete('/:id', contractRepository.deleteShipmentContract);

module.exports = router;