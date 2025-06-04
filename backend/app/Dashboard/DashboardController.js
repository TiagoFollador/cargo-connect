const express = require('express');
const router = express.Router();
const dashboardRepository = require('./DashboardRepository');
const { authenticateToken, authorizeRoles } = require('../Auth/AuthMiddleware');


/**
 * GET /api/dashboard/shipper/summary
 * Fetches summary data for the shipper dashboard.
 * Requires 'shipper' role.
 */
router.get('/shipper/summary', authenticateToken, authorizeRoles('shipper'), async (req, res) => {
    try {
        const userId = req.user.userId;
        const summary = await dashboardRepository.getShipperSummary(userId);
        res.status(200).json(summary);
    } catch (error) {
        console.error('Error fetching shipper dashboard summary:', error);
        res.status(500).json({ error: 'Failed to fetch shipper summary.', details: error.message });
    }
});

/**
 * GET /api/dashboard/shipper/recent-shipments
 * Fetches recent shipments for the shipper dashboard.
 * Requires 'shipper' role.
 */
router.get('/shipper/recent-shipments', authenticateToken, authorizeRoles('shipper'), async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page, limit } = req.query;
        const shipments = await dashboardRepository.getShipperRecentShipments(userId, { page, limit });
        // For full pagination, also return totalItems, totalPages, currentPage
        res.status(200).json(shipments);
    } catch (error) {
        console.error('Error fetching shipper recent shipments:', error);
        res.status(500).json({ error: 'Failed to fetch recent shipments.', details: error.message });
    }
});

/**
 * GET /api/dashboard/carrier/summary
 * Fetches summary data for the carrier dashboard.
 * Requires 'carrier' role.
 */
router.get('/carrier/summary', authenticateToken, authorizeRoles('carrier'), async (req, res) => {
    try {
        const userId = req.user.userId;
        const summary = await dashboardRepository.getCarrierSummary(userId);
        res.status(200).json(summary);
    } catch (error) {
        console.error('Error fetching carrier dashboard summary:', error);
        res.status(500).json({ error: 'Failed to fetch carrier summary.', details: error.message });
    }
});

/**
 * GET /api/dashboard/carrier/recent-services
 * Fetches recent services for the carrier dashboard.
 * Requires 'carrier' role.
 */
router.get('/carrier/recent-services', authenticateToken, authorizeRoles('carrier'), async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page, limit } = req.query;
        const services = await dashboardRepository.getCarrierRecentServices(userId, { page, limit });
        res.status(200).json(services);
    } catch (error) {
        console.error('Error fetching carrier recent services:', error);
        res.status(500).json({ error: 'Failed to fetch recent services.', details: error.message });
    }
});

/**
 * GET /api/dashboard/carrier/my-offers
 * Fetches offers made by the carrier.
 * Requires 'carrier' role.
 */
router.get('/carrier/my-offers', authenticateToken, authorizeRoles('carrier'), async (req, res) => {
    try {
        const userId = req.user.userId;
        const { status, page, limit } = req.query;
        const offers = await dashboardRepository.getCarrierMyOffers(userId, { status, page, limit });
        res.status(200).json(offers);
    } catch (error) {
        console.error('Error fetching carrier offers:', error);
        res.status(500).json({ error: 'Failed to fetch carrier offers.', details: error.message });
    }
});

/**
 * GET /api/dashboard/carrier/charts/revenue
 * Fetches revenue chart data for the carrier.
 * Requires 'carrier' role.
 */
router.get('/carrier/charts/revenue', authenticateToken, authorizeRoles('carrier'), async (req, res) => {
    try {
        const userId = req.user.userId;
        const { period, startDate, endDate } = req.query; // Add more validation for these params
        const chartData = await dashboardRepository.getCarrierRevenueChartData(userId, { period, startDate, endDate });
        res.status(200).json(chartData);
    } catch (error) {
        console.error('Error fetching carrier revenue chart data:', error);
        res.status(500).json({ error: 'Failed to fetch revenue data.', details: error.message });
    }
});

module.exports = router;