const express = require('express');
const router = express.Router();

const authController = require('./Auth/AuthController');
const { authenticateToken, authorizeRoles } = require('./Auth/AuthMiddleware');
const userRoutes = require('./Users/UserController.js');
const rolesRoutes = require('./roles.js');
const cargoTypesRoutes = require('./CargoTypes/CargoTypesController.js');
const vehicleTypesRoutes = require('./VehicleTypes/VehicleTypesController.js');
const userVehiclesRoutes = require('./UsersVehicle/UserVehicleController.js');
const shipmentRoutes = require('./Shipments/ShipmentController.js');
const shipmentOfferRoutes = require('./ShipmentOffers/ShipmentOfferController.js');
const shipmentContractRoutes = require('./ShipmentContracts/ShipmentContractController.js');
const shipmentStatusUpdateRoutes = require('./ShipmentStatusUpdate/ShipmentStatusUpdateController.js');
const notificationRoutes = require('./Notifications/NotificationsController.js');
const companyContactRoutes = require('./CompanyContact/CompanyContactController.js');
const userReviewsRoutes = require('./UserReviews/UserReviewsController.js');
const landingPageRoutes = require('./LandingPage/LandingPageController.js');
const dashboardRoutes = require('./Dashboard/DashboardController.js');

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.use('/landingpage', landingPageRoutes);
router.use('/cargo_types', cargoTypesRoutes);
router.use('/vehicle_types', vehicleTypesRoutes);
router.use('/company-contact', companyContactRoutes);
router.use('/shipments', shipmentRoutes);

router.use(authenticateToken);

router.use('/users', userRoutes);
router.use('/roles', authorizeRoles('admin'), rolesRoutes);
router.use('/user_vehicles', userVehiclesRoutes);
router.use('/shipment_offers', shipmentOfferRoutes);
router.use('/shipment_contracts', shipmentContractRoutes);
router.use('/shipment-status-updates', shipmentStatusUpdateRoutes);
router.use('/notifications', notificationRoutes);
router.use('/user-reviews', userReviewsRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;