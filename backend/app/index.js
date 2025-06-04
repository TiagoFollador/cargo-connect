// routes.js
const express = require('express');
const router = express.Router();

const authController = require('./Auth/AuthController');
const { authenticateToken, authorizeRoles } = require('./Auth/AuthMiddleware');
const userRoutes = require('./Users/UserController.js');
const rolesRoutes = require('./roles.js');
const vehicleTypesRoutes = require('./VehicleTypes/VehicleTypesController.js');
const userVehiclesRoutes = require('./UsersVehicle/UserVehicleController.js');
const shipmentRoutes = require('./Shipments/ShipmentController.js');
const shipmentOfferRoutes = require('./ShipmentOffers/ShipmentOfferController.js'); 
const shipmentContractRoutes = require('./ShipmentContracts/ShipmentContractController.js'); // Added
const shipmentStatusUpdateRoutes = require('./ShipmentStatusUpdate/ShipmentStatusUpdateController.js'); // Added

// =========================================================================
// ROTAS PÚBLICAS DE AUTENTICAÇÃO
// =========================================================================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

router.use(authenticateToken);

// =========================================================================
// ROTAS PROTEGIDAS
// =========================================================================

router.use('/users', userRoutes);
router.use('/roles', authorizeRoles('admin'), rolesRoutes);
router.use('/vehicle_types', vehicleTypesRoutes);
router.use('/user_vehicles', userVehiclesRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/shipment_offers', shipmentOfferRoutes);
router.use('/shipment_contracts', shipmentContractRoutes);
router.use('/shipment-status-updates', shipmentStatusUpdateRoutes);


module.exports = router;