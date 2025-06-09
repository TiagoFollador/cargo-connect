const express = require('express');
const router = express.Router();
const vehicleTypesRepository = require('./VehicleTypesRepository');

router.post('/', vehicleTypesRepository.createVehicleType);

router.get('/', vehicleTypesRepository.getAllVehicleTypes);

router.get('/:id', vehicleTypesRepository.getVehicleTypeById);

router.put('/:id', vehicleTypesRepository.updateVehicleType);

router.delete('/:id', vehicleTypesRepository.deleteVehicleType);

module.exports = router;