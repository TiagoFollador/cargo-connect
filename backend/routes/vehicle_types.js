const express = require('express');
const router = express.Router();
const db = require('../db'); // Your database connection module

// Create a new vehicle type
router.post('/', async (req, res) => {
    const { name, description, capacity_kg } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Vehicle type name is required.' });
    }
    if (name.length > 50) {
        return res.status(400).json({ error: 'Vehicle type name cannot exceed 50 characters.' });
    }
    if (description && description.length > 255) {
        return res.status(400).json({ error: 'Description cannot exceed 255 characters.' });
    }
    if (capacity_kg && (isNaN(parseFloat(capacity_kg)) || !/^\d+(\.\d{1,2})?$/.test(capacity_kg))) {
        return res.status(400).json({ error: 'Capacity_kg must be a valid decimal number with up to 2 decimal places (e.g., 1000.00).' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO vehicle_types (name, description, capacity_kg) VALUES (?, ?, ?)',
            [name, description, capacity_kg ? parseFloat(capacity_kg) : null]
        );
        res.status(201).json({ id: result.insertId, name, description, capacity_kg: capacity_kg ? parseFloat(capacity_kg) : null });
    } catch (error) {
        console.error('Failed to create vehicle type:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Vehicle type name already exists.' });
        }
        res.status(500).json({ error: 'Failed to create vehicle type', details: error.message });
    }
});

// Get all vehicle types
router.get('/', async (req, res) => {
    try {
        const [types] = await db.query('SELECT id, name, description, capacity_kg, created_at, updated_at FROM vehicle_types');
        res.status(200).json({ vehicle_types: types });
    } catch (error) {
        console.error('Failed to retrieve vehicle types:', error);
        res.status(500).json({ error: 'Failed to retrieve vehicle types', details: error.message });
    }
});

// Get a single vehicle type by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id, 10))) {
        return res.status(400).json({ error: 'Invalid ID format.' });
    }
    try {
        const [types] = await db.query('SELECT id, name, description, capacity_kg, created_at, updated_at FROM vehicle_types WHERE id = ?', [id]);
        if (types.length > 0) {
            res.status(200).json({ vehicle_type: types[0] });
        } else {
            res.status(404).json({ error: 'Vehicle type not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve vehicle type:', error);
        res.status(500).json({ error: 'Failed to retrieve vehicle type', details: error.message });
    }
});

// Update a vehicle type by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, capacity_kg } = req.body;

    if (isNaN(parseInt(id, 10))) {
        return res.status(400).json({ error: 'Invalid ID format.' });
    }

    if (!name && !description && capacity_kg === undefined) {
        return res.status(400).json({ error: 'No fields to update provided.' });
    }
    if (name && name.length > 50) {
        return res.status(400).json({ error: 'Vehicle type name cannot exceed 50 characters.' });
    }
    if (description && description.length > 255) {
        return res.status(400).json({ error: 'Description cannot exceed 255 characters.' });
    }
    if (capacity_kg !== undefined && (isNaN(parseFloat(capacity_kg)) || !/^\d+(\.\d{1,2})?$/.test(capacity_kg))) {
        return res.status(400).json({ error: 'Capacity_kg must be a valid decimal number with up to 2 decimal places (e.g., 1000.00).' });
    }

    try {
        const [result] = await db.query(
            'UPDATE vehicle_types SET name = COALESCE(?, name), description = COALESCE(?, description), capacity_kg = COALESCE(?, capacity_kg) WHERE id = ?',
            [name, description, capacity_kg ? parseFloat(capacity_kg) : undefined, id]
        );
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Vehicle type updated successfully', id });
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
});

// Delete a vehicle type by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id, 10))) {
        return res.status(400).json({ error: 'Invalid ID format.' });
    }
    try {
        const [result] = await db.query('DELETE FROM vehicle_types WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Vehicle type deleted successfully' });
        } else {
            res.status(404).json({ error: 'Vehicle type not found' });
        }
    } catch (error) {
        console.error('Failed to delete vehicle type:', error);
        // ER_ROW_IS_REFERENCED_2: Cannot delete or update a parent row: a foreign key constraint fails
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ error: 'Cannot delete vehicle type. It is currently in use by one or more vehicles or shipments.' });
        }
        res.status(500).json({ error: 'Failed to delete vehicle type', details: error.message });
    }
});

module.exports = router;