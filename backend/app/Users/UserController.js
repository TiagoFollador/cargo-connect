const express = require('express');
const router = express.Router();
const db = require('../../db.js');
const bcrypt = require('bcrypt');
const UserRepository = require('./UserRepository'); 
const { authenticateToken } = require('../Auth/AuthMiddleware'); 


router.post('/', async (req, res) => {
    const { email, password, name, phone, profile_picture_url, role_id } = req.body;

    if (!email || !password || !name || !phone || role_id === undefined) {
        return res.status(400).json({ error: 'Missing required fields: email, password, name, phone, role_id are required.' });
    }

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

    const phoneRegex = /^\d{10,}$/; 
    if (phone && !phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format.' });
    }

    let connection;
    try {
        connection = await db.getConnection(); 
        await connection.beginTransaction(); 

        const roleExists = await UserRepository.checkRoleExistsInTransaction(role_id, connection);
        if (!roleExists) {
            await connection.rollback();
            return res.status(400).json({ error: `Invalid role_id: Role with id ${role_id} does not exist.` });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 
        const userData = { email, name, phone, profile_picture_url };

        const userId = await UserRepository.createUserInTransaction(userData, hashedPassword, connection);
        await UserRepository.assignRoleInTransaction(userId, role_id, connection);

        await connection.commit(); 

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
            await connection.rollback(); 
        }
        console.error('Error during user creation or role assignment:', error);
        if (error.code === 'ER_DUP_ENTRY' && error.message.includes("for key 'users.email'")) {
            return res.status(409).json({ error: 'Email already exists.' });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2' && error.message && error.message.includes("FOREIGN KEY (`role_id`) REFERENCES `roles`")) {
            return res.status(400).json({ error: `Invalid role_id: Role with id ${role_id} does not exist.` });
        }
        res.status(500).json({ error: 'Failed to create user or assign role.', details: error.message });
    } finally {
        if (connection) {
            connection.release(); 
        }
    }
});


router.get('/', async (req, res) => {
    try {
        const users = await UserRepository.findAllUsers();
        return res.status(200).json({ users });
    } catch (error) {
        console.error('Failed to retrieve users:', error);
        res.status(500).json({ error: 'Failed to retrieve users', details: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserRepository.findUserById(id);
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve user:', error);
        res.status(500).json({ error: 'Failed to retrieve user', details: error.message });
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; 
        const profile = await UserRepository.getUserProfile(userId);
        if (!profile) {
            return res.status(404).json({ error: 'User profile not found.' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching user profile for dashboard:', error);
        res.status(500).json({ error: 'Failed to fetch user profile.', details: error.message });
    }
});



router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phone, profile_picture_url } = req.body;

    const phoneRegex = /^\d{10,}$/;
    if (phone !== undefined && phone !== null && !phoneRegex.test(phone)) { 
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (profile_picture_url !== undefined) updateFields.profile_picture_url = profile_picture_url;

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: 'No fields to update provided' });
    }

    try {
        const existingUser = await UserRepository.findUserById(id); 
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const result = await UserRepository.updateUser(id, updateFields);
        if (result.affectedRows > 0) {
            const updatedUser = await UserRepository.findAllUsers(id);
            res.status(200).json({ message: `User ${id} updated successfully`, user: updatedUser });
        } else {
            const currentUser = await UserRepository.findAllUsers(id); 
            res.status(200).json({ message: 'No data changed for user.', user: currentUser });
        }
    } catch (error) {
        console.error('Failed to update user:', error);
        res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
});

router.patch('/:id/role', async (req, res) => {
    const { id: userId } = req.params; 
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

        const userExists = await UserRepository.checkUserExistsInTransaction(userId, connection);
        if (!userExists) {
            await connection.rollback();
            return res.status(404).json({ error: 'User not found' });
        }

        const roleExists = await UserRepository.checkRoleExistsInTransaction(role_id, connection);
        if (!roleExists) {
            await connection.rollback();
            return res.status(400).json({ error: `Invalid role_id: Role with id ${role_id} does not exist.` });
        }

        await UserRepository.replaceUserRoleInTransaction(userId, role_id, connection);
        await connection.commit();

        res.status(200).json({ message: `User ${id} role updated successfully to role_id ${role_id}` });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Failed to update user role:', error);
        res.status(500).json({ error: 'Failed to update user role', details: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const existingUser = await UserRepository.findUserById(id);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const result = await UserRepository.deleteUser(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: `User ${id} deleted successfully` });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Failed to delete user:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ error: 'Cannot delete user. They are referenced in other parts of the system.' });
        }
        res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
});

module.exports = router;