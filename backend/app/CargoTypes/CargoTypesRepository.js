const db = require('../../db.js');

/**
 * Creates a new cargo type.
 */
exports.createCargoType = async (req, res) => {
    const { name, description } = req.body;
    let { requires_special_handling } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Cargo type name is required.' });
    }
    if (name.length > 50) {
        return res.status(400).json({ error: 'Cargo type name cannot exceed 50 characters.' });
    }
    if (description && description.length > 255) {
        return res.status(400).json({ error: 'Description cannot exceed 255 characters.' });
    }

    // Validate and normalize requires_special_handling
    if (requires_special_handling !== undefined && typeof requires_special_handling !== 'boolean') {
        if (typeof requires_special_handling === 'string') {
            if (requires_special_handling.toLowerCase() === 'true') {
                requires_special_handling = true;
            } else if (requires_special_handling.toLowerCase() === 'false') {
                requires_special_handling = false;
            } else {
                return res.status(400).json({ error: 'requires_special_handling must be a boolean (true/false).' });
            }
        } else {
            return res.status(400).json({ error: 'requires_special_handling must be a boolean.' });
        }
    } else if (requires_special_handling === undefined) {
        requires_special_handling = false; // Default value
    }

    try {
        const [result] = await db.query(
            'INSERT INTO cargo_types (name, description, requires_special_handling) VALUES (?, ?, ?)',
            [name, description, requires_special_handling]
        );
        res.status(201).json({ id: result.insertId, name, description, requires_special_handling });
    } catch (error) {
        console.error('Failed to create cargo type:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Cargo type name already exists.' });
        }
        res.status(500).json({ error: 'Failed to create cargo type', details: error.message });
    }
};

/**
 * Retrieves all cargo types.
 */
exports.getAllCargoTypes = async (req, res) => {
    try {
        const [types] = await db.query('SELECT id, name, description, requires_special_handling, created_at, updated_at FROM cargo_types');
        res.status(200).json(types);
    } catch (error) {
        console.error('Failed to retrieve cargo types:', error);
        res.status(500).json({ error: 'Failed to retrieve cargo types', details: error.message });
    }
};

/**
 * Retrieves a single cargo type by its ID.
 */
exports.getCargoTypeById = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const [types] = await db.query('SELECT id, name, description, requires_special_handling, created_at, updated_at FROM cargo_types WHERE id = ?', [parsedId]);
        if (types.length > 0) {
            res.status(200).json(types[0]);
        } else {
            res.status(404).json({ error: 'Cargo type not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve cargo type:', error);
        res.status(500).json({ error: 'Failed to retrieve cargo type', details: error.message });
    }
};

/**
 * Updates an existing cargo type.
 */
exports.updateCargoType = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    const { name, description } = req.body;
    let { requires_special_handling } = req.body;

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (description !== undefined) fieldsToUpdate.description = description;
    if (requires_special_handling !== undefined) {
         if (typeof requires_special_handling === 'string') {
            if (requires_special_handling.toLowerCase() === 'true') fieldsToUpdate.requires_special_handling = true;
            else if (requires_special_handling.toLowerCase() === 'false') fieldsToUpdate.requires_special_handling = false;
            else return res.status(400).json({ error: 'requires_special_handling must be a boolean (true/false) if provided as string.' });
        } else if (typeof requires_special_handling === 'boolean') {
            fieldsToUpdate.requires_special_handling = requires_special_handling;
        } else {
             return res.status(400).json({ error: 'requires_special_handling must be a boolean.' });
        }
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'No fields to update provided.' });
    }

    try {
        const [result] = await db.query('UPDATE cargo_types SET ? WHERE id = ?', [fieldsToUpdate, parsedId]);
        if (result.affectedRows > 0) {
            const [updatedType] = await db.query('SELECT * FROM cargo_types WHERE id = ?', [parsedId]);
            res.status(200).json(updatedType[0]);
        } else {
            res.status(404).json({ error: 'Cargo type not found or no new data to update' });
        }
    } catch (error) {
        console.error('Failed to update cargo type:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Cargo type name already exists.' });
        }
        res.status(500).json({ error: 'Failed to update cargo type', details: error.message });
    }
};

/**
 * Deletes a cargo type by its ID.
 */
exports.deleteCargoType = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const [result] = await db.query('DELETE FROM cargo_types WHERE id = ?', [parsedId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cargo type deleted successfully' });
        } else {
            res.status(404).json({ error: 'Cargo type not found' });
        }
    } catch (error) {
        console.error('Failed to delete cargo type:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ error: 'Cannot delete cargo type. It is currently in use.' });
        }
        res.status(500).json({ error: 'Failed to delete cargo type', details: error.message });
    }
};