const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.post('/', async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Role name is required.' });
    }
    if (name.length > 20) {
        return res.status(400).json({ error: 'Role name cannot exceed 20 characters.' });
    }
    if (description && description.length > 100) {
        return res.status(400).json({ error: 'Description cannot exceed 100 characters.' });
    }

    try {
        const [result] = await db.query('INSERT INTO roles (name, description) VALUES (?, ?)', [name, description]);
        res.status(201).json({ id: result.insertId, name, description });
    } catch (error) {
        console.error('Failed to create role:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Role name already exists.' });
        }
        res.status(500).json({ error: 'Failed to create role', details: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const [roles] = await db.query('SELECT id, name, description, created_at, updated_at FROM roles');
        res.status(200).json({ roles });
    } catch (error) {
        console.error('Failed to retrieve roles:', error);
        res.status(500).json({ error: 'Failed to retrieve roles', details: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [roles] = await db.query('SELECT id, name, description, created_at, updated_at FROM roles WHERE id = ?', [id]);
        if (roles.length > 0) {
            res.status(200).json({ role: roles[0] });
        } else {
            res.status(404).json({ error: 'Role not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve role:', error);
        res.status(500).json({ error: 'Failed to retrieve role', details: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name && !description) {
        return res.status(400).json({ error: 'No fields to update provided.' });
    }

    try {
        const [result] = await db.query('UPDATE roles SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?', [name, description, id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Role updated successfully', id });
        } else {
            res.status(404).json({ error: 'Role not found or no new data to update' });
        }
    } catch (error) {
        console.error('Failed to update role:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Role name already exists.' });
        }
        res.status(500).json({ error: 'Failed to update role', details: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM roles WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Role deleted successfully' });
        } else {
            res.status(404).json({ error: 'Role not found' });
        }
    } catch (error) {
        console.error('Failed to delete role:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ error: 'Cannot delete role. It is currently assigned to one or more users.' });
        }
        res.status(500).json({ error: 'Failed to delete role', details: error.message });
    }
});

module.exports = router;