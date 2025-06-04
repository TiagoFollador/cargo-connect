const express = require('express');
const router = express.Router();
const shipmentStatusUpdateRepository = require('./ShipmentStatusUpdateRepository');

// Create a new shipment status update
// POST /api/shipment-status-updates
router.post('/', shipmentStatusUpdateRepository.createShipmentStatusUpdate);

// Get a single shipment status update by ID
// GET /api/shipment-status-updates/:id
router.get('/:id', shipmentStatusUpdateRepository.getShipmentStatusUpdateById);

// Get all status updates for a specific contract (the "research" function)
// GET /api/shipment-status-updates/contract/:contractId
router.get('/contract/:contractId', shipmentStatusUpdateRepository.getShipmentStatusUpdatesByContractId);

// Update a shipment status update by ID (Note: Updating log entries is generally discouraged)
// PUT /api/shipment-status-updates/:id
router.put('/:id', shipmentStatusUpdateRepository.updateShipmentStatusUpdate);

// Delete a shipment status update by ID (Note: Deleting log entries is generally discouraged)
// DELETE /api/shipment-status-updates/:id
router.delete('/:id', shipmentStatusUpdateRepository.deleteShipmentStatusUpdate);

module.exports = router;