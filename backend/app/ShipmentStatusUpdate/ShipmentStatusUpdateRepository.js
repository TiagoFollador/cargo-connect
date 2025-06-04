const db = require('../../db.js');

// Helper to check if Shipment Contract exists
async function checkShipmentContractExists(contractId, connection = db) {
    const [rows] = await connection.query('SELECT id FROM shipment_contracts WHERE id = ?', [contractId]);
    return rows.length > 0;
}

const VALID_STATUS_UPDATES = ['loading', 'in_transit', 'delayed', 'delivered', 'issue_reported'];

/**
 * Creates a new shipment status update record.
 * POST /api/shipment-status-updates
 */
exports.createShipmentStatusUpdate = async (req, res) => {
    const {
        contract_id, status, location, latitude, longitude, notes
    } = req.body;

    // Basic validation for required fields
    if (contract_id === undefined || !status) {
        return res.status(400).json({ error: 'Missing required fields: contract_id, status are required.' });
    }

    // Validate status
    if (!VALID_STATUS_UPDATES.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUS_UPDATES.join(', ')}` });
    }

    // Validate data types (optional, but good practice)
    if (contract_id !== undefined && (typeof contract_id !== 'number' || !Number.isInteger(contract_id) || contract_id <= 0)) {
        return res.status(400).json({ error: 'contract_id must be a positive integer.' });
    }
    if (latitude !== undefined && latitude !== null && (typeof latitude !== 'number' || latitude < -90 || latitude > 90)) {
        return res.status(400).json({ error: 'latitude must be a number between -90 and 90 or null.' });
    }
    if (longitude !== undefined && longitude !== null && (typeof longitude !== 'number' || longitude < -180 || longitude > 180)) {
        return res.status(400).json({ error: 'longitude must be a number between -180 and 180 or null.' });
    }

    try {
        // Check foreign key existence
        if (!await checkShipmentContractExists(contract_id)) {
            return res.status(404).json({ error: `Shipment contract with id ${contract_id} not found.` });
        }

        const updateData = {
            contract_id, status, location, latitude, longitude, notes
        };

        const [result] = await db.query('INSERT INTO shipment_status_updates SET ?', updateData);
        res.status(201).json({ id: result.insertId, ...updateData });

    } catch (error) {
        console.error('Failed to create shipment status update:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'Invalid foreign key. Ensure contract exists.', details: error.message });
        }
        res.status(500).json({ error: 'Failed to create shipment status update', details: error.message });
    }
};

/**
 * Retrieves a single shipment status update by its ID.
 * GET /api/shipment-status-updates/:id
 */
exports.getShipmentStatusUpdateById = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const [updates] = await db.query('SELECT * FROM shipment_status_updates WHERE id = ?', [parsedId]);
        if (updates.length > 0) {
            res.status(200).json(updates[0]);
        } else {
            res.status(404).json({ error: 'Shipment status update not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve shipment status update:', error);
        res.status(500).json({ error: 'Failed to retrieve shipment status update', details: error.message });
    }
};

/**
 * Retrieves all status updates for a specific contract, ordered by creation time.
 * This is the "research" or log retrieval function.
 * GET /api/shipment-status-updates/contract/:contractId
 */
exports.getShipmentStatusUpdatesByContractId = async (req, res) => {
    const contractId = parseInt(req.params.contractId, 10);
    if (isNaN(contractId)) {
        return res.status(400).json({ error: 'Invalid Contract ID format. ID must be an integer.' });
    }

    try {
        // Optional: Check if the contract exists first, return 404 if not.
        // If you don't check, an empty array will be returned for non-existent contracts, which might also be acceptable depending on desired behavior.
        if (!await checkShipmentContractExists(contractId)) {
            return res.status(404).json({ error: `Shipment contract with id ${contractId} not found.` });
        }

        const query = `
            SELECT * FROM shipment_status_updates
            WHERE contract_id = ?
            ORDER BY created_at ASC
        `;
        const [updates] = await db.query(query, [contractId]);
        res.status(200).json(updates);
    } catch (error) {
        console.error(`Failed to retrieve status updates for contract ${contractId}:`, error);
        res.status(500).json({ error: 'Failed to retrieve shipment status updates', details: error.message });
    }
};

/**
 * Updates an existing shipment status update record.
 * Note: Updating log entries is less common and potentially problematic for auditing.
 * Consider if this endpoint is truly necessary or if creating new entries is preferred.
 * PUT /api/shipment-status-updates/:id
 */
exports.updateShipmentStatusUpdate = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    const {
        status, location, latitude, longitude, notes
    } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No fields to update provided.' });
    }

    const fieldsToUpdate = {};
    // Only allow updating specific fields relevant to correcting a log entry
    if (status !== undefined) {
        if (!VALID_STATUS_UPDATES.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUS_UPDATES.join(', ')}` });
        }
        fieldsToUpdate.status = status;
    }
    if (location !== undefined) fieldsToUpdate.location = location; // Allow null
    if (latitude !== undefined) { // Allow null
        if (latitude !== null && (typeof latitude !== 'number' || latitude < -90 || latitude > 90)) {
            return res.status(400).json({ error: 'latitude must be a number between -90 and 90 or null.' });
        }
        fieldsToUpdate.latitude = latitude;
    }
    if (longitude !== undefined) { // Allow null
        if (longitude !== null && (typeof longitude !== 'number' || longitude < -180 || longitude > 180)) {
            return res.status(400).json({ error: 'longitude must be a number between -180 and 180 or null.' });
        }
        fieldsToUpdate.longitude = longitude;
    }
    if (notes !== undefined) fieldsToUpdate.notes = notes; // Allow null

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update provided.' });
    }

    try {
        // Check if update exists
        const [existingUpdates] = await db.query('SELECT id FROM shipment_status_updates WHERE id = ?', [parsedId]);
        if (existingUpdates.length === 0) {
            return res.status(404).json({ error: 'Shipment status update not found' });
        }

        const [result] = await db.query('UPDATE shipment_status_updates SET ? WHERE id = ?', [fieldsToUpdate, parsedId]);

        if (result.affectedRows > 0) {
            // Fetch the updated record to return
            const [updatedUpdate] = await db.query('SELECT * FROM shipment_status_updates WHERE id = ?', [parsedId]);
            res.status(200).json(updatedUpdate[0]);
        } else {
            // This might happen if data is identical
            res.status(200).json({ message: 'No data changed for shipment status update.' });
        }
    } catch (error) {
        console.error('Failed to update shipment status update:', error);
        res.status(500).json({ error: 'Failed to update shipment status update', details: error.message });
    }
};

/**
 * Deletes a shipment status update record by its ID.
 * Note: Deleting log entries is generally discouraged for auditing purposes.
 * DELETE /api/shipment-status-updates/:id
 */
exports.deleteShipmentStatusUpdate = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const [result] = await db.query('DELETE FROM shipment_status_updates WHERE id = ?', [parsedId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Shipment status update deleted successfully' });
        } else {
            res.status(404).json({ error: 'Shipment status update not found' });
        }
    } catch (error) {
        console.error('Failed to delete shipment status update:', error);
        res.status(500).json({ error: 'Failed to delete shipment status update', details: error.message });
    }
};