const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.post('/', async (req, res) => {
    const { email, password, name, phone, profile_picture_url } = req.body;
    if (!email || !password || !name || !phone) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const phoneRegex = /^\d{10,}$/;
    if (phone && !phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    try {
        // const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const result = await db.query(
            'INSERT INTO users (email, password, name, phone, profile_picture_url) VALUES (?, ?, ?, ?, ?)',
            [email, password, name, phone, profile_picture_url]
        );
        res.status(201).json({
            message: 'User created successfully',
            user: { id: result.insertId, email, name, phone, profile_picture_url }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});


router.get('/', async (req, res) => {
    try {
        const users = await db.query('SELECT id, email, name, phone, profile_picture_url, rating, trips_completed, last_login, created_at, updated_at FROM users');
        return res.status(200).json({ users: users[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await db.query('SELECT id, email, name, phone, profile_picture_url, rating, trips_completed, last_login, created_at, updated_at FROM users WHERE id = ?', [id]);
        if (user[0].length > 0) {
            res.status(200).json(user[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phone, profile_picture_url } = req.body;

    const phoneRegex = /^\d{10,}$/;
    if (phone && !phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    if (!name && !phone && !profile_picture_url) {
        return res.status(400).json({ error: 'No fields to update provided' });
    }

    try {
        await db.query('UPDATE users SET name = ?, phone = ?, profile_picture_url = ? WHERE id = ?', [name, phone, profile_picture_url, id]);
        res.json({ message: `User ${id} updated successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: `User ${id} deleted successfully ` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;