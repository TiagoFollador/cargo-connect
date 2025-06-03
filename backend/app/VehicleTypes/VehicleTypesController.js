const express = require('express');
const router = express.Router();
const vehicleTypesRepository = require('./VehicleTypesRepository');

// Create a new vehicle type
router.post('/', vehicleTypesRepository.createVehicleType);

// Get all vehicle types
router.get('/', vehicleTypesRepository.getAllVehicleTypes);

// Get a single vehicle type by ID
router.get('/:id', vehicleTypesRepository.getVehicleTypeById);

// Update a vehicle type by ID
router.put('/:id', vehicleTypesRepository.updateVehicleType);

// Delete a vehicle type by ID
router.delete('/:id', vehicleTypesRepository.deleteVehicleType);

module.exports = router;