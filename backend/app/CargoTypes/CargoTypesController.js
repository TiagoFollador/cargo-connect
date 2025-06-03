const express = require('express');
const router = express.Router();
const cargoTypesRepository = require('./CargoTypesRepository');

// Create a new cargo type
router.post('/', cargoTypesRepository.createCargoType);

// Get all cargo types
router.get('/', cargoTypesRepository.getAllCargoTypes);

// Get a single cargo type by ID
router.get('/:id', cargoTypesRepository.getCargoTypeById);

// Update a cargo type by ID
router.put('/:id', cargoTypesRepository.updateCargoType);

// Delete a cargo type by ID
router.delete('/:id', cargoTypesRepository.deleteCargoType);

module.exports = router;