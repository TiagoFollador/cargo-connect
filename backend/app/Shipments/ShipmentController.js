const express = require('express');
const router = express.Router();
const shipmentRepository = require('./ShipmentRepository');

// Create a new shipment
router.post('/', shipmentRepository.createShipment);

// Get all shipments (with search/filter capabilities)
router.get('/', shipmentRepository.getAllShipments);

// Get a single shipment by ID
router.get('/:id', shipmentRepository.getShipmentById);

// Update a shipment by ID
router.put('/:id', shipmentRepository.updateShipment);

// Delete a shipment by ID
router.delete('/:id', shipmentRepository.deleteShipment);

module.exports = router;