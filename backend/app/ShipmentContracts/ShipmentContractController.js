const express = require('express');
const router = express.Router();
const contractRepository = require('./ShipmentContractRepository');

router.post('/', contractRepository.createShipmentContract);

router.get('/', contractRepository.getAllShipmentContracts);

router.get('/:id', contractRepository.getShipmentContractById);

router.get('/shipment/:shipmentId', contractRepository.getContractByShipmentId);

router.put('/:id', contractRepository.updateShipmentContract);

router.delete('/:id', contractRepository.deleteShipmentContract);

module.exports = router;