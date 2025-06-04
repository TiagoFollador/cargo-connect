const db = require('../../db.js');

// Helper to check if Shipment exists
async function checkShipmentExists(shipmentId, connection = db) {
    const [rows] = await connection.query('SELECT id FROM shipments WHERE id = ?', [shipmentId]);
    return rows.length > 0;
}

// Helper to check if ShipmentOffer exists
async function checkShipmentOfferExists(offerId, connection = db) {
    const [rows] = await connection.query('SELECT id FROM shipment_offers WHERE id = ?', [offerId]);
    return rows.length > 0;
}

// Helper to check if a contract is referenced in user_reviews
async function checkContractReferencedInReviews(contractId, connection = db) {
    const [rows] = await connection.query('SELECT id FROM user_reviews WHERE contract_id = ?', [contractId]);
    return rows.length > 0;
}

const VALID_CONTRACT_STATUSES = ['active', 'completed', 'cancelled', 'disputed'];

/**
 * Creates a new shipment contract.
 */
exports.createShipmentContract = async (req, res) => {
    const {
        shipment_id, offer_id, final_price, carrier_notes,
        shipper_notes, contract_terms, status = 'active' // Default status
    } = req.body;

    // Basic validation for required fields
    if (shipment_id === undefined || offer_id === undefined || final_price === undefined) {
        return res.status(400).json({ error: 'Missing required fields: shipment_id, offer_id, final_price are required.' });
    }

    // Validate status
    if (!VALID_CONTRACT_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_CONTRACT_STATUSES.join(', ')}` });
    }

    // Validate data types
    if (typeof final_price !== 'number' || final_price <= 0) {
        return res.status(400).json({ error: 'final_price must be a positive number.' });
    }

    try {
        // Check foreign key existences
        if (!await checkShipmentExists(shipment_id)) {
            return res.status(404).json({ error: `Shipment with id ${shipment_id} not found.` });
        }
        if (!await checkShipmentOfferExists(offer_id)) {
            return res.status(404).json({ error: `Shipment offer with id ${offer_id} not found.` });
        }

        const contractData = {
            shipment_id, offer_id, final_price, carrier_notes,
            shipper_notes, contract_terms, status
        };

        const [result] = await db.query('INSERT INTO shipment_contracts SET ?', contractData);
        res.status(201).json({ id: result.insertId, ...contractData });

    } catch (error) {
        console.error('Failed to create shipment contract:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes("'shipment_id'")) {
                return res.status(409).json({ error: `A contract for shipment_id ${shipment_id} already exists.` });
            }
            if (error.message.includes("'offer_id'")) {
                return res.status(409).json({ error: `A contract for offer_id ${offer_id} already exists.` });
            }
            return res.status(409).json({ error: 'Duplicate entry. Shipment ID or Offer ID might already be in a contract.', details: error.message });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'Invalid foreign key. Ensure shipment and offer exist.', details: error.message });
        }
        res.status(500).json({ error: 'Failed to create shipment contract', details: error.message });
    }
};

/**
 * Retrieves all shipment contracts with optional search filters.
 */
exports.getAllShipmentContracts = async (req, res) => {
    try {
        let query = `
            SELECT sc.*, 
                   s.title as shipment_title, 
                   so.user_id as carrier_user_id, 
                   s.user_id as shipper_user_id 
            FROM shipment_contracts sc
            JOIN shipments s ON sc.shipment_id = s.id
            JOIN shipment_offers so ON sc.offer_id = so.id
        `;
        const conditions = [];
        const params = [];

        if (req.query.shipment_id) {
            conditions.push('sc.shipment_id = ?');
            params.push(req.query.shipment_id);
        }
        if (req.query.offer_id) {
            conditions.push('sc.offer_id = ?');
            params.push(req.query.offer_id);
        }
        if (req.query.status) {
            if (VALID_CONTRACT_STATUSES.includes(req.query.status)) {
                conditions.push('sc.status = ?');
                params.push(req.query.status);
            } else {
                return res.status(400).json({ error: `Invalid status filter. Must be one of: ${VALID_CONTRACT_STATUSES.join(', ')}` });
            }
        }
        if (req.query.carrier_user_id) {
            conditions.push('so.user_id = ?');
            params.push(req.query.carrier_user_id);
        }
        if (req.query.shipper_user_id) {
            conditions.push('s.user_id = ?');
            params.push(req.query.shipper_user_id);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY sc.created_at DESC'; // Default ordering

        const [contracts] = await db.query(query, params);
        res.status(200).json(contracts);
    } catch (error) {
        console.error('Failed to retrieve shipment contracts:', error);
        res.status(500).json({ error: 'Failed to retrieve shipment contracts', details: error.message });
    }
};

/**
 * Retrieves a single shipment contract by its ID.
 */
exports.getShipmentContractById = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const query = `
            SELECT sc.*, 
                   s.title as shipment_title, 
                   so.user_id as carrier_user_id, 
                   s.user_id as shipper_user_id 
            FROM shipment_contracts sc
            JOIN shipments s ON sc.shipment_id = s.id
            JOIN shipment_offers so ON sc.offer_id = so.id
            WHERE sc.id = ?
        `;
        const [contracts] = await db.query(query, [parsedId]);
        if (contracts.length > 0) {
            res.status(200).json(contracts[0]);
        } else {
            res.status(404).json({ error: 'Shipment contract not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve shipment contract:', error);
        res.status(500).json({ error: 'Failed to retrieve shipment contract', details: error.message });
    }
};

/**
 * Updates an existing shipment contract.
 * Note: shipment_id and offer_id are generally not updatable once a contract is formed.
 */
exports.updateShipmentContract = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    const {
        final_price, carrier_notes, shipper_notes, contract_terms, status
    } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No fields to update provided.' });
    }

    const fieldsToUpdate = {};
    if (final_price !== undefined) {
        if (typeof final_price !== 'number' || final_price <= 0) return res.status(400).json({ error: 'final_price must be a positive number.' });
        fieldsToUpdate.final_price = final_price;
    }
    if (carrier_notes !== undefined) fieldsToUpdate.carrier_notes = carrier_notes; // Allow null
    if (shipper_notes !== undefined) fieldsToUpdate.shipper_notes = shipper_notes; // Allow null
    if (contract_terms !== undefined) fieldsToUpdate.contract_terms = contract_terms; // Allow null
    if (status !== undefined) {
        if (!VALID_CONTRACT_STATUSES.includes(status)) return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_CONTRACT_STATUSES.join(', ')}` });
        fieldsToUpdate.status = status;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update provided.' });
    }

    try {
        const [existingContracts] = await db.query('SELECT * FROM shipment_contracts WHERE id = ?', [parsedId]);
        if (existingContracts.length === 0) {
            return res.status(404).json({ error: 'Shipment contract not found' });
        }

        const [result] = await db.query('UPDATE shipment_contracts SET ? WHERE id = ?', [fieldsToUpdate, parsedId]);

        if (result.affectedRows > 0) {
            const [updatedContract] = await db.query('SELECT * FROM shipment_contracts WHERE id = ?', [parsedId]);
            res.status(200).json(updatedContract[0]);
        } else {
            // This might happen if data is identical
            res.status(200).json(existingContracts[0]); // Return existing data if no change
        }
    } catch (error) {
        console.error('Failed to update shipment contract:', error);
        res.status(500).json({ error: 'Failed to update shipment contract', details: error.message });
    }
};

/**
 * Deletes a shipment contract by its ID.
 */
exports.deleteShipmentContract = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        // Check if the contract is referenced in user_reviews, as user_reviews does not have ON DELETE CASCADE
        if (await checkContractReferencedInReviews(parsedId)) {
            return res.status(409).json({
                error: 'Cannot delete shipment contract. It is referenced in user reviews. Please remove associated reviews first or handle them appropriately.',
            });
        }

        // shipment_status_updates has ON DELETE CASCADE, so they will be deleted automatically.

        const [result] = await db.query('DELETE FROM shipment_contracts WHERE id = ?', [parsedId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Shipment contract deleted successfully' });
        } else {
            res.status(404).json({ error: 'Shipment contract not found' });
        }
    } catch (error) {
        console.error('Failed to delete shipment contract:', error);
        // ER_ROW_IS_REFERENCED_2 could still occur if other unhandled FK constraints exist.
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ error: 'Cannot delete shipment contract. It is referenced in other records.', details: error.message });
        }
        res.status(500).json({ error: 'Failed to delete shipment contract', details: error.message });
    }
};

/**
 * Retrieves a shipment contract by shipment_id.
 */
exports.getContractByShipmentId = async (req, res) => {
    const shipmentId = parseInt(req.params.shipmentId, 10);
    if (isNaN(shipmentId)) {
        return res.status(400).json({ error: 'Invalid Shipment ID format. ID must be an integer.' });
    }

    try {
        const [contracts] = await db.query('SELECT * FROM shipment_contracts WHERE shipment_id = ?', [shipmentId]);
        if (contracts.length > 0) {
            res.status(200).json(contracts[0]); // shipment_id is unique
        } else {
            res.status(404).json({ error: `Shipment contract not found for shipment_id ${shipmentId}` });
        }
    } catch (error) {
        console.error(`Failed to retrieve contract for shipment ${shipmentId}:`, error);
        res.status(500).json({ error: 'Failed to retrieve shipment contract', details: error.message });
    }
};