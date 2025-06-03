const express = require('express');
const userRoutes = require('./users.js');
const rolesRoutes = require('./roles.js');
const vehicleTypesRoutes = require('./vehicle_types');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/roles', rolesRoutes);
router.use('/vehicle_types', vehicleTypesRoutes);

module.exports = router;