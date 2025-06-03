const express = require('express');
const userRoutes = require('./Users/UserController.js');
const rolesRoutes = require('./roles.js');
const vehicleTypesRoutes = require('./vehicle_types');
const userVehiclesRoutes = require('./UsersVehicle/UserVehicleController.js');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/roles', rolesRoutes);
router.use('/vehicle_types', vehicleTypesRoutes);
router.use('/user_vehicles', userVehiclesRoutes);

module.exports = router;