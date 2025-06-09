const express = require('express');
const router = express.Router();
const cargoTypesRepository = require('./CargoTypesRepository');

router.post('/', cargoTypesRepository.createCargoType);

router.get('/', cargoTypesRepository.getAllCargoTypes);

router.get('/:id', cargoTypesRepository.getCargoTypeById);

router.put('/:id', cargoTypesRepository.updateCargoType);

router.delete('/:id', cargoTypesRepository.deleteCargoType);

module.exports = router;