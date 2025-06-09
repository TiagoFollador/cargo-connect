const db = require('../../db.js'); 

exports.createVehicleType = async (req, res) => {
    const { name, description } = req.body;
    let { capacity_kg } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Vehicle type name is required.' });
    }
    if (name.length > 50) {
        return res.status(400).json({ error: 'Vehicle type name cannot exceed 50 characters.' });
    }
    if (description && description.length > 255) {
        return res.status(400).json({ error: 'Description cannot exceed 255 characters.' });
    }

    let parsedCapacityKg = null;
    if (capacity_kg !== undefined && capacity_kg !== null) {
        if (isNaN(parseFloat(capacity_kg)) || (typeof capacity_kg === 'string' && !/^\d+(\.\d{1,2})?$/.test(capacity_kg))) {
            return res.status(400).json({ error: 'Capacity_kg must be a valid decimal number with up to 2 decimal places (e.g., 1000.00) or null.' });
        }
        parsedCapacityKg = parseFloat(capacity_kg);
    }

    try {
        const [result] = await db.query(
            'INSERT INTO vehicle_types (name, description, capacity_kg) VALUES (?, ?, ?)',
            [name, description, parsedCapacityKg]
        );
        res.status(201).json({ id: result.insertId, name, description, capacity_kg: parsedCapacityKg });
    } catch (error) {
        console.error('Failed to create vehicle type:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Vehicle type name already exists.' });
        }
        res.status(500).json({ error: 'Failed to create vehicle type', details: error.message });
    }
};

exports.getAllVehicleTypes = async (req, res) => {
    try {
        const [types] = await db.query('SELECT id, name, description, capacity_kg, created_at, updated_at FROM vehicle_types');
        res.status(200).json(types); 
    } catch (error) {
        console.error('Failed to retrieve vehicle types:', error);
        res.status(500).json({ error: 'Failed to retrieve vehicle types', details: error.message });
    }
};

exports.getVehicleTypeById = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }
    try {
        const [types] = await db.query('SELECT id, name, description, capacity_kg, created_at, updated_at FROM vehicle_types WHERE id = ?', [parsedId]);
        if (types.length > 0) {
            res.status(200).json(types[0]); 
        } else {
            res.status(404).json({ error: 'Vehicle type not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve vehicle type:', error);
        res.status(500).json({ error: 'Failed to retrieve vehicle type', details: error.message });
    }
};

exports.updateVehicleType = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    const { name, description, capacity_kg } = req.body;
    const fieldsToUpdate = {};

    if (name !== undefined) fieldsToUpdate.name = name;
    if (description !== undefined) fieldsToUpdate.description = description;
    if (capacity_kg !== undefined) {
        if (capacity_kg === null) fieldsToUpdate.capacity_kg = null;
        else if (isNaN(parseFloat(capacity_kg)) || (typeof capacity_kg === 'string' && !/^\d+(\.\d{1,2})?$/.test(capacity_kg))) {
            return res.status(400).json({ error: 'Capacity_kg must be a valid decimal number with up to 2 decimal places (e.g., 1000.00) or null.' });
        } else fieldsToUpdate.capacity_kg = parseFloat(capacity_kg);
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'No fields to update provided.' });
    }

    try {
        const [result] = await db.query('UPDATE vehicle_types SET ? WHERE id = ?', [fieldsToUpdate, parsedId]);
        if (result.affectedRows > 0) {
            const [updatedType] = await db.query('SELECT * FROM vehicle_types WHERE id = ?', [parsedId]);
            res.status(200).json(updatedType[0]);
        } else {
            res.status(404).json({ error: 'Vehicle type not found or no new data to update' });
        }
    } catch (error) {
        console.error('Failed to update vehicle type:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Vehicle type name already exists.' });
        }
        res.status(500).json({ error: 'Failed to update vehicle type', details: error.message });
    }
};

exports.deleteVehicleType = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }
    try {
        const [result] = await db.query('DELETE FROM vehicle_types WHERE id = ?', [parsedId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Vehicle type deleted successfully' });
        } else {
            res.status(404).json({ error: 'Vehicle type not found' });
        }
    } catch (error) {
        console.error('Failed to delete vehicle type:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ error: 'Cannot delete vehicle type. It is currently in use by one or more vehicles or shipments.' });
        }
        res.status(500).json({ error: 'Failed to delete vehicle type', details: error.message });
    }
};