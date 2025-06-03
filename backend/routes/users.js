const express = require('express');
const router = express.Router();
const db = require('../db.js');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { email, password, name, phone, profile_picture_url, role_id } = req.body;

    // Validate required fields
    if (!email || !password || !name || !phone || role_id === undefined) {
        return res.status(400).json({ error: 'Missing required fields: email, password, name, phone, role_id are required.' });
    }

    // Validate role_id type
    if (typeof role_id !== 'number' || !Number.isInteger(role_id) || role_id <= 0) {
        return res.status(400).json({ error: 'Invalid role_id: must be a positive integer.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const phoneRegex = /^\d{10,}$/; // Adjust if you need more specific phone validation e.g. E.164
    if (phone && !phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format.' });
    }

    let connection;
    try {
        connection = await db.getConnection(); // Get a connection from the pool
        await connection.beginTransaction(); // Start a transaction

        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const [userResult] = await connection.query( // Use connection for queries within transaction
            'INSERT INTO users (email, password, name, phone, profile_picture_url) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, name, phone, profile_picture_url || null] // Handle optional profile_picture_url
        );
        const userId = userResult.insertId;

        // Insert into user_roles table
        await connection.query(
            'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
            [userId, role_id]
        );

        await connection.commit(); // Commit the transaction

        res.status(201).json({
            message: 'User created and role assigned successfully.',
            user: { 
                id: userId, 
                email, 
                name, 
                phone, 
                profile_picture_url: profile_picture_url || null,
                role_id 
            }
        });
    } catch (error) {
        if (connection) {
            await connection.rollback(); // Rollback transaction on error
        }
        console.error('Error during user creation or role assignment:', error);
        if (error.code === 'ER_DUP_ENTRY' && error.message.includes("for key 'users.email'")) {
            return res.status(409).json({ error: 'Email already exists.' });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2' && error.message.includes("FOREIGN KEY (`role_id`) REFERENCES `roles`")) {
            return res.status(400).json({ error: `Invalid role_id: Role with id ${role_id} does not exist.` });
        }
        res.status(500).json({ error: 'Failed to create user or assign role.', details: error.message });
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
});


router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id, 
                u.email, 
                u.name, 
                u.phone, 
                u.profile_picture_url, 
                u.rating, 
                u.trips_completed, 
                u.last_login, 
                u.created_at, 
                u.updated_at,
                ur.role_id,
                r.name AS role_name
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id;
        `;
        const [userRows] = await db.query(query);
        return res.status(200).json({ users: userRows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT 
                u.id, 
                u.email, 
                u.name, 
                u.phone, 
                u.profile_picture_url, 
                u.rating, 
                u.trips_completed, 
                u.last_login, 
                u.created_at, 
                u.updated_at,
                ur.role_id,
                r.name AS role_name
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.id = ?;
        `;
        const [userRows] = await db.query(query, [id]);
        if (userRows.length > 0) {
            res.status(200).json({ user: userRows[0] });
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
    if (phone !== undefined && phone !== null && !phoneRegex.test(phone)) { // Validate only if phone is provided
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    // Allow setting profile_picture_url to null
    if (profile_picture_url !== undefined) updateFields.profile_picture_url = profile_picture_url;

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: 'No fields to update provided' });
    }

    const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateFields), id];

    try {
        const [result] = await db.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);
        if (result.affectedRows > 0) {
            const [updatedUserRows] = await db.query('SELECT id, email, name, phone, profile_picture_url, rating, trips_completed, last_login, created_at, updated_at FROM users WHERE id = ?', [id]);
            res.status(200).json({ message: `User ${id} updated successfully`, user: updatedUserRows[0] });
        } else {
            res.status(404).json({ error: 'User not found or no data changed' });
        }
    } catch (error) {
        console.error('Failed to update user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Update user's role by user ID
router.patch('/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role_id } = req.body;

    if (role_id === undefined) {
        return res.status(400).json({ error: 'role_id is required.' });
    }

    if (typeof role_id !== 'number' || !Number.isInteger(role_id) || role_id <= 0) {
        return res.status(400).json({ error: 'Invalid role_id: must be a positive integer.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Check if the user exists
        const [userRows] = await connection.query('SELECT id FROM users WHERE id = ?', [id]);
        if (userRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the role exists
        const [roleRows] = await connection.query('SELECT id FROM roles WHERE id = ?', [role_id]);
        if (roleRows.length === 0) {
            await connection.rollback();
            return res.status(400).json({ error: `Invalid role_id: Role with id ${role_id} does not exist.` });
        }

        // Update or insert into user_roles table
        // Use REPLACE INTO to handle cases where the user already has a role
        await connection.query(
            'REPLACE INTO user_roles (user_id, role_id) VALUES (?, ?)',
            [id, role_id]
        );

        await connection.commit();

        res.status(200).json({ message: `User ${id} role updated successfully to role_id ${role_id}` });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Failed to update user role:', error);
        res.status(500).json({ error: 'Failed to update user' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


// Delete a user by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: `User ${id} deleted successfully` });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});



module.exports = router;