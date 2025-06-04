const db = require('../../db.js');
const UserRepository = require('../Users/UserRepository');

// Helper to check if CargoType exists
async function checkCargoTypeExists(cargoTypeId, connection = db) {
    const [rows] = await connection.query('SELECT id FROM cargo_types WHERE id = ?', [cargoTypeId]);
    return rows.length > 0;
}

// Helper to check if VehicleType exists
async function checkVehicleTypeExists(vehicleTypeId, connection = db) {
    if (vehicleTypeId === null || vehicleTypeId === undefined) return true; // Allow null
    const [rows] = await connection.query('SELECT id FROM vehicle_types WHERE id = ?', [vehicleTypeId]);
    return rows.length > 0;
}

const VALID_SHIPMENT_STATUSES = ['pending', 'active', 'in_transit', 'delivered', 'cancelled'];

/**
 * Creates a new shipment.
 */
exports.createShipment = async (req, res) => {
    const {
        user_id, title, description, cargo_type_id, weight_kg, volume_m3,
        pickup_location, pickup_latitude, pickup_longitude, pickup_date,
        delivery_location, delivery_latitude, delivery_longitude, delivery_date,
        required_vehicle_type_id, price_offer, status = 'pending' // Default status
    } = req.body;

    // Basic validation for required fields
    if (!user_id || !title || !cargo_type_id || weight_kg === undefined || !pickup_location || !pickup_date || !delivery_location || !delivery_date) {
        return res.status(400).json({ error: 'Missing required fields: user_id, title, cargo_type_id, weight_kg, pickup_location, pickup_date, delivery_location, delivery_date are required.' });
    }

    // Validate status
    if (status && !VALID_SHIPMENT_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_SHIPMENT_STATUSES.join(', ')}` });
    }

    // Validate data types (simple checks, more can be added)
    if (typeof weight_kg !== 'number' || weight_kg <= 0) {
        return res.status(400).json({ error: 'weight_kg must be a positive number.' });
    }
    if (volume_m3 !== undefined && (typeof volume_m3 !== 'number' || volume_m3 <= 0)) {
        return res.status(400).json({ error: 'volume_m3 must be a positive number if provided.' });
    }
    if (price_offer !== undefined && (typeof price_offer !== 'number' || price_offer < 0)) {
        return res.status(400).json({ error: 'price_offer must be a non-negative number if provided.' });
    }

    try {
        // Check foreign key existences
        const userExists = await UserRepository.findUserById(user_id);
        if (!userExists) {
            return res.status(404).json({ error: `User with id ${user_id} not found.` });
        }
        if (!await checkCargoTypeExists(cargo_type_id)) {
            return res.status(404).json({ error: `Cargo type with id ${cargo_type_id} not found.` });
        }
        if (required_vehicle_type_id && !await checkVehicleTypeExists(required_vehicle_type_id)) {
            return res.status(404).json({ error: `Vehicle type with id ${required_vehicle_type_id} not found.` });
        }

        const shipmentData = {
            user_id, title, description, cargo_type_id, weight_kg, volume_m3,
            pickup_location, pickup_latitude, pickup_longitude, pickup_date,
            delivery_location, delivery_latitude, delivery_longitude, delivery_date,
            required_vehicle_type_id, price_offer, status
        };

        const [result] = await db.query('INSERT INTO shipments SET ?', shipmentData);
        res.status(201).json({ id: result.insertId, ...shipmentData });

    } catch (error) {
        console.error('Failed to create shipment:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'Invalid foreign key. Ensure user, cargo type, and vehicle type (if provided) exist.', details: error.message });
        }
        res.status(500).json({ error: 'Failed to create shipment', details: error.message });
    }
};

/**
 * Retrieves all shipments with optional search filters.
 */
exports.getAllShipments = async (req, res) => {
    try {
        let query = 'SELECT * FROM shipments';
        const conditions = [];
        const params = [];

        // Example filters (can be expanded)
        if (req.query.user_id) {
            conditions.push('user_id = ?');
            params.push(req.query.user_id);
        }
        if (req.query.cargo_type_id) {
            conditions.push('cargo_type_id = ?');
            params.push(req.query.cargo_type_id);
        }
        if (req.query.required_vehicle_type_id) {
            conditions.push('required_vehicle_type_id = ?');
            params.push(req.query.required_vehicle_type_id);
        }
        if (req.query.status) {
            if (VALID_SHIPMENT_STATUSES.includes(req.query.status)) {
                conditions.push('status = ?');
                params.push(req.query.status);
            } else {
                return res.status(400).json({ error: `Invalid status filter. Must be one of: ${VALID_SHIPMENT_STATUSES.join(', ')}` });
            }
        }
        if (req.query.pickup_location) {
            conditions.push('pickup_location LIKE ?');
            params.push(`%${req.query.pickup_location}%`);
        }
        if (req.query.delivery_location) {
            conditions.push('delivery_location LIKE ?');
            params.push(`%${req.query.delivery_location}%`);
        }
        if (req.query.pickup_date_from) {
            conditions.push('pickup_date >= ?');
            params.push(req.query.pickup_date_from);
        }
        if (req.query.pickup_date_to) {
            conditions.push('pickup_date <= ?');
            params.push(req.query.pickup_date_to);
        }
        // Add more filters as needed (e.g., weight range, price range)

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY created_at DESC'; // Default ordering

        const [shipments] = await db.query(query, params);
        res.status(200).json(shipments);
    } catch (error) {
        console.error('Failed to retrieve shipments:', error);
        res.status(500).json({ error: 'Failed to retrieve shipments', details: error.message });
    }
};

/**
 * Retrieves a single shipment by its ID.
 */
exports.getShipmentById = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const [shipments] = await db.query('SELECT * FROM shipments WHERE id = ?', [parsedId]);
        if (shipments.length > 0) {
            res.status(200).json(shipments[0]);
        } else {
            res.status(404).json({ error: 'Shipment not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve shipment:', error);
        res.status(500).json({ error: 'Failed to retrieve shipment', details: error.message });
    }
};

/**
 * Updates an existing shipment.
 */
exports.updateShipment = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    const {
        user_id, title, description, cargo_type_id, weight_kg, volume_m3,
        pickup_location, pickup_latitude, pickup_longitude, pickup_date,
        delivery_location, delivery_latitude, delivery_longitude, delivery_date,
        required_vehicle_type_id, price_offer, status
    } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No fields to update provided.' });
    }

    const fieldsToUpdate = {};
    // Conditionally add fields to update object
    if (user_id !== undefined) fieldsToUpdate.user_id = user_id;
    if (title !== undefined) fieldsToUpdate.title = title;
    if (description !== undefined) fieldsToUpdate.description = description; // Allow null
    if (cargo_type_id !== undefined) fieldsToUpdate.cargo_type_id = cargo_type_id;
    if (weight_kg !== undefined) {
        if (typeof weight_kg !== 'number' || weight_kg <= 0) return res.status(400).json({ error: 'weight_kg must be a positive number.' });
        fieldsToUpdate.weight_kg = weight_kg;
    }
    if (volume_m3 !== undefined) { // Allow null
        if (volume_m3 !== null && (typeof volume_m3 !== 'number' || volume_m3 <= 0)) return res.status(400).json({ error: 'volume_m3 must be a positive number or null.' });
        fieldsToUpdate.volume_m3 = volume_m3;
    }
    if (pickup_location !== undefined) fieldsToUpdate.pickup_location = pickup_location;
    if (pickup_latitude !== undefined) fieldsToUpdate.pickup_latitude = pickup_latitude; // Allow null
    if (pickup_longitude !== undefined) fieldsToUpdate.pickup_longitude = pickup_longitude; // Allow null
    if (pickup_date !== undefined) fieldsToUpdate.pickup_date = pickup_date;
    if (delivery_location !== undefined) fieldsToUpdate.delivery_location = delivery_location;
    if (delivery_latitude !== undefined) fieldsToUpdate.delivery_latitude = delivery_latitude; // Allow null
    if (delivery_longitude !== undefined) fieldsToUpdate.delivery_longitude = delivery_longitude; // Allow null
    if (delivery_date !== undefined) fieldsToUpdate.delivery_date = delivery_date;
    if (required_vehicle_type_id !== undefined) fieldsToUpdate.required_vehicle_type_id = required_vehicle_type_id; // Allow null
    if (price_offer !== undefined) { // Allow null
        if (price_offer !== null && (typeof price_offer !== 'number' || price_offer < 0)) return res.status(400).json({ error: 'price_offer must be a non-negative number or null.' });
        fieldsToUpdate.price_offer = price_offer;
    }
    if (status !== undefined) {
        if (!VALID_SHIPMENT_STATUSES.includes(status)) return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_SHIPMENT_STATUSES.join(', ')}` });
        fieldsToUpdate.status = status;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update provided.' });
    }

    try {
        // Check if shipment exists
        const [existingShipments] = await db.query('SELECT * FROM shipments WHERE id = ?', [parsedId]);
        if (existingShipments.length === 0) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        // Validate foreign keys if they are being updated
        if (fieldsToUpdate.user_id) {
            const userExists = await UserRepository.findUserById(fieldsToUpdate.user_id);
            if (!userExists) return res.status(404).json({ error: `User with id ${fieldsToUpdate.user_id} not found.` });
        }
        if (fieldsToUpdate.cargo_type_id && !await checkCargoTypeExists(fieldsToUpdate.cargo_type_id)) {
            return res.status(404).json({ error: `Cargo type with id ${fieldsToUpdate.cargo_type_id} not found.` });
        }
        if (fieldsToUpdate.required_vehicle_type_id !== undefined && !await checkVehicleTypeExists(fieldsToUpdate.required_vehicle_type_id)) {
            return res.status(404).json({ error: `Vehicle type with id ${fieldsToUpdate.required_vehicle_type_id} not found.` });
        }

        const [result] = await db.query('UPDATE shipments SET ? WHERE id = ?', [fieldsToUpdate, parsedId]);

        if (result.affectedRows > 0) {
            const [updatedShipment] = await db.query('SELECT * FROM shipments WHERE id = ?', [parsedId]);
            res.status(200).json(updatedShipment[0]);
        } else {
            // This might happen if data is identical or shipment not found (though we check above)
            res.status(404).json({ error: 'Shipment not found or no new data to update' });
        }
    } catch (error) {
        console.error('Failed to update shipment:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'Invalid foreign key. Ensure user, cargo type, and vehicle type (if provided) exist.', details: error.message });
        }
        res.status(500).json({ error: 'Failed to update shipment', details: error.message });
    }
};

/**
 * Deletes a shipment by its ID.
 */
exports.deleteShipment = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        // Note: Deleting a shipment might be restricted if it's referenced in shipment_offers or shipment_contracts
        // The schema provided doesn't have ON DELETE CASCADE for these, so a direct delete might fail if referenced.
        // For now, we attempt a direct delete.
        const [result] = await db.query('DELETE FROM shipments WHERE id = ?', [parsedId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Shipment deleted successfully' });
        } else {
            res.status(404).json({ error: 'Shipment not found' });
        }
    } catch (error) {
        console.error('Failed to delete shipment:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ error: 'Cannot delete shipment. It is referenced in other records (e.g., offers, contracts).' });
        }
        res.status(500).json({ error: 'Failed to delete shipment', details: error.message });
    }
};

/**
 * Searches for shipments based on various filter criteria with pagination.
 * Includes shipper information and cargo type name.
 */
exports.searchShipments = async (filters) => {
    const {
        cargoTypeId,
        origin,
        destination,
        vehicleTypeId,
        minPriceOffer,
        maxPriceOffer,
        page = 1, // Default to page 1
        limit = 10 // Default to 10 items per page
    } = filters;

    let query = `
        SELECT
            s.id AS shipmentId,
            s.title,
            s.pickup_location AS origin,
            s.delivery_location AS destination,
            s.price_offer AS priceOffer,
            ct.name AS cargoType,
            s.pickup_date AS pickupDate,
            s.delivery_date AS deliveryDate,
            s.status AS shipmentStatus,
            u.id AS shipperUserId,
            u.name AS shipperName,
            u.rating AS shipperRating,
            u.trips_completed AS shipperTripsCompleted,
            u.profile_picture_url AS shipperProfilePictureUrl
        FROM shipments s
        JOIN users u ON s.user_id = u.id
        JOIN cargo_types ct ON s.cargo_type_id = ct.id
    `;

    const conditions = [];
    const params = [];

    // Only show shipments that are 'pending' (available for offers)
    conditions.push("s.status = 'pending'");

    if (cargoTypeId) {
        conditions.push('s.cargo_type_id = ?');
        params.push(parseInt(cargoTypeId, 10));
    }
    if (origin) {
        conditions.push('s.pickup_location LIKE ?');
        params.push(`%${origin}%`);
    }
    if (destination) {
        conditions.push('s.delivery_location LIKE ?');
        params.push(`%${destination}%`);
    }
    if (vehicleTypeId) {
        conditions.push('s.required_vehicle_type_id = ?');
        params.push(parseInt(vehicleTypeId, 10));
    }
    if (minPriceOffer) {
        conditions.push('s.price_offer >= ?');
        params.push(parseFloat(minPriceOffer));
    }
    if (maxPriceOffer) {
        conditions.push('s.price_offer <= ?');
        params.push(parseFloat(maxPriceOffer));
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY s.created_at DESC'; // Or other relevant ordering

    // For pagination
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), offset);

    const [shipments] = await db.query(query, params);

    // We would also need a count query for total pages, but for simplicity,
    // we'll return just the shipments for now.
    // A full implementation would run a similar query with COUNT(*)
    return shipments;
};

/**
 * Retrieves detailed information for a single shipment by its ID.
 * Includes shipper info, cargo type details, and vehicle type details.
 */
exports.getShipmentDetailsById = async (shipmentId) => {
    const query = `
        SELECT
            s.id AS shipmentId,
            s.title,
            s.description,
            ct.id AS cargoTypeId,
            ct.name AS cargoTypeName,
            ct.description AS cargoTypeDescription,
            s.weight_kg AS weightKg,
            s.volume_m3 AS volumeM3,
            s.pickup_location AS pickupLocation,
            s.pickup_latitude AS pickupLatitude,
            s.pickup_longitude AS pickupLongitude,
            s.pickup_date AS pickupDate,
            s.delivery_location AS deliveryLocation,
            s.delivery_latitude AS deliveryLatitude,
            s.delivery_longitude AS deliveryLongitude,
            s.delivery_date AS deliveryDate,
            vt.id AS vehicleTypeId,
            vt.name AS vehicleTypeName,
            s.price_offer AS priceOffer,
            s.status,
            u.id AS shipperUserId,
            u.name AS shipperName,
            u.rating AS shipperRating,
            u.trips_completed AS shipperTripsCompleted,
            u.profile_picture_url AS shipperProfilePictureUrl,
            s.created_at AS createdAt,
            s.updated_at AS updatedAt
        FROM shipments s
        JOIN users u ON s.user_id = u.id
        JOIN cargo_types ct ON s.cargo_type_id = ct.id
        LEFT JOIN vehicle_types vt ON s.required_vehicle_type_id = vt.id
        WHERE s.id = ?;
    `;
    try {
        const [rows] = await db.query(query, [shipmentId]);
        if (rows.length > 0) {
            return rows[0];
        }
        return null; // Shipment not found
    } catch (error) {
        console.error(`Error fetching shipment details for ID ${shipmentId} in repository:`, error);
        throw error; // Re-throw to be handled by the controller
    }
};

