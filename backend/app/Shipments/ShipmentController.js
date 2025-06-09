const express = require('express');
const router = express.Router();
const shipmentRepository = require('./ShipmentRepository');

router.post('/', shipmentRepository.createShipment);

router.get('/search', async (req, res) => {
    try {
        const {shipments, page, limit} = await shipmentRepository.searchShipments(req.query);
        const shipmentData = shipments.map(shipment => ({
            shipmentId: shipment.shipmentId,
            title: shipment.title,
            origin: shipment.origin,
            destination: shipment.destination,
            priceOffer: shipment.priceOffer,
            cargoType: shipment.cargoType,
            pickupDate: shipment.pickupDate,
            deliveryDate: shipment.deliveryDate,
            shipperInfo: {
                userId: shipment.shipperUserId,
                name: shipment.shipperName,
                rating: shipment.shipperRating,
                tripsCompleted: shipment.shipperTripsCompleted,
                profilePictureUrl: shipment.shipperProfilePictureUrl
            }
        }));
        const response = {
            shipments: shipmentData,
            page,
            limit
        }
        res.status(200).json(response);
    } catch (error) {
        console.error('Error searching shipments:', error);
        res.status(500).json({ error: 'Failed to search for shipments', details: error.message });
    }
});

router.get('/', shipmentRepository.getAllShipments);

router.get('/:shipmentId/details', async (req, res) => {
    try {
        const shipmentId = parseInt(req.params.shipmentId, 10);
        if (isNaN(shipmentId)) {
            return res.status(400).json({ error: 'Invalid Shipment ID format.' });
        }

        const details = await shipmentRepository.getShipmentDetailsById(shipmentId);

        if (!details) {
            return res.status(404).json({ error: 'Shipment not found.' });
        }

        const response = {
            shipmentId: details.shipmentId,
            title: details.title,
            description: details.description,
            cargoType: {
                id: details.cargoTypeId,
                name: details.cargoTypeName,
                description: details.cargoTypeDescription
            },
            weightKg: details.weightKg,
            volumeM3: details.volumeM3,
            pickupLocation: details.pickupLocation,
            pickupLatitude: details.pickupLatitude,
            pickupLongitude: details.pickupLongitude,
            pickupDate: details.pickupDate,
            deliveryLocation: details.deliveryLocation,
            deliveryLatitude: details.deliveryLatitude,
            deliveryLongitude: details.deliveryLongitude,
            deliveryDate: details.deliveryDate,
            requiredVehicleType: details.vehicleTypeId ? {
                id: details.vehicleTypeId,
                name: details.vehicleTypeName
            } : null,
            priceOffer: details.priceOffer,
            status: details.status,
            shipperInfo: {
                userId: details.shipperUserId,
                name: details.shipperName,
                rating: details.shipperRating,
                tripsCompleted: details.shipperTripsCompleted,
                profilePictureUrl: details.shipperProfilePictureUrl
            },
            createdAt: details.createdAt,
            updatedAt: details.updatedAt
        };
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shipment details.', details: error.message });
    }
});

router.get('/:id', shipmentRepository.getShipmentById);

router.put('/:id', shipmentRepository.updateShipment);

router.delete('/:id', shipmentRepository.deleteShipment);

module.exports = router;