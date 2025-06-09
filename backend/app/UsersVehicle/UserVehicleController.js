const express = require('express');
const router = express.Router();
const userVehiclesController = require('./UserVehicleRepository');

router.post('/', userVehiclesController.createUserVehicle);

router.get('/', userVehiclesController.getAllUserVehicles);

router.get('/:id', userVehiclesController.getUserVehicleById);

router.get('/user/:userId', userVehiclesController.getUserVehiclesByUserId);

router.put('/:id', userVehiclesController.updateUserVehicle);

router.delete('/:id', userVehiclesController.deleteUserVehicle);

module.exports = router;