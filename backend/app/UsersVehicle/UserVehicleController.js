const express = require('express');
const router = express.Router();
const userVehiclesController = require('./UserVehicleRepository');

// Create a new user vehicle
router.post('/', userVehiclesController.createUserVehicle);

// Get all user vehicles
router.get('/', userVehiclesController.getAllUserVehicles);

// Get a single user vehicle by ID
router.get('/:id', userVehiclesController.getUserVehicleById);

// Update a user vehicle by ID
router.put('/:id', userVehiclesController.updateUserVehicle);

// Delete a user vehicle by ID
router.delete('/:id', userVehiclesController.deleteUserVehicle);

module.exports = router;