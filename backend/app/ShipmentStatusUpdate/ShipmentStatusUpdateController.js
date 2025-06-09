const express = require('express');
const router = express.Router();
const shipmentStatusUpdateRepository = require('./ShipmentStatusUpdateRepository');

router.post('/', shipmentStatusUpdateRepository.createShipmentStatusUpdate);

router.get('/:id', shipmentStatusUpdateRepository.getShipmentStatusUpdateById);

router.get('/contract/:contractId', shipmentStatusUpdateRepository.getShipmentStatusUpdatesByContractId);

router.put('/:id', shipmentStatusUpdateRepository.updateShipmentStatusUpdate);

router.delete('/:id', shipmentStatusUpdateRepository.deleteShipmentStatusUpdate);

module.exports = router;