const db = require('../../db.js');
const UserRepository = require('../Users/UserRepository');


// Helper function to check if a vehicle type exists
async function checkVehicleTypeExists(vehicleTypeId) {
    const [rows] = await db.query('SELECT id FROM vehicle_types WHERE id = ?', [vehicleTypeId]);
    return rows.length > 0;
}

// Helper function to check if license plate is unique (optionally excluding a specific vehicle ID for updates)
async function checkLicensePlateUnique(licensePlate, excludeVehicleId = null) {
    let query = 'SELECT id FROM user_vehicles WHERE license_plate = ?';
    const params = [licensePlate];
    if (excludeVehicleId) {
        query += ' AND id != ?';
        params.push(excludeVehicleId);
    }
    const [rows] = await db.query(query, params);
    return rows.length === 0;
}

exports.createUserVehicle = async (req, res) => {
    const {
        user_id, vehicle_type_id, make, model, year, license_plate, capacity_kg, is_active = true
    } = req.body;

    // Basic validation
    if (!user_id || !vehicle_type_id || !make || !model || !license_plate || capacity_kg === undefined) {
        return res.status(400).json({ error: 'Missing required fields: user_id, vehicle_type_id, make, model, license_plate, capacity_kg' });
    }

    try {
        const user = await UserRepository.findUserById(user_id)
        if (!user) {
            return res.status(404).json({ error: `User with id ${user_id} not found.` });
        }

        // Verify if vehicle type exists
        if (!await checkVehicleTypeExists(vehicle_type_id)) {
            return res.status(404).json({ error: `Vehicle type with id ${vehicle_type_id} not found.` });
        }

        // Verify if license plate is unique
        if (!await checkLicensePlateUnique(license_plate)) {
            return res.status(409).json({ error: `License plate ${license_plate} already exists.` });
        }

        const [result] = await db.query(
            'INSERT INTO user_vehicles (user_id, vehicle_type_id, make, model, year, license_plate, capacity_kg, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, vehicle_type_id, make, model, year, license_plate, capacity_kg, is_active]
        );

        res.status(201).json({
            id: result.insertId,
            user_id,
            user_name: user.name,
            vehicle_type_id,
            make,
            model,
            year,
            license_plate,
            capacity_kg,
            is_active
        });
    } catch (error) {
        console.error('Error creating user vehicle:', error);
        res.status(500).json({ error: 'Failed to create user vehicle', details: error.message });
    }
};

exports.getAllUserVehicles = async (req, res) => {
    try {
        const [vehicles] = await db.query('SELECT * FROM user_vehicles');
        const user = await UserRepository.findUserById(vehicles[0].user_id)

        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error fetching user vehicles:', error);
        res.status(500).json({ error: 'Failed to fetch user vehicles', details: error.message });
    }
};

exports.getUserVehicleById = async (req, res) => {
    const { id } = req.params;
    try {
        const [vehicles] = await db.query('SELECT * FROM user_vehicles WHERE id = ?', [id]);
        const user = await UserRepository.findUserById(vehicles[0].user_id)

        if (vehicles.length === 0) {
            return res.status(404).json({ error: 'User vehicle not found' });
        }
        res.status(200).json({user_vehicle: vehicles[0], user: user});
    } catch (error) {
        console.error('Error fetching user vehicle by ID:', error);
        res.status(500).json({ error: 'Failed to fetch user vehicle', details: error.message });
    }
};

exports.updateUserVehicle = async (req, res) => {
    const { id } = req.params;
    const {
        user_id, vehicle_type_id, make, model, year, license_plate, capacity_kg, is_active
    } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No fields provided for update.' });
    }

    try {
        // Check if the vehicle to update exists
        const [existingVehicles] = await db.query('SELECT * FROM user_vehicles WHERE id = ?', [id]);
        if (existingVehicles.length === 0) {
            return res.status(404).json({ error: 'User vehicle not found' });
        }

        // Verify user_id if provided
        if (user_id !== undefined && !await UserRepository.findUserById(user_id)) {
            return res.status(404).json({ error: `User with id ${user_id} not found.` });
        }

        // Verify vehicle_type_id if provided
        if (vehicle_type_id !== undefined && !await checkVehicleTypeExists(vehicle_type_id)) {
            return res.status(404).json({ error: `Vehicle type with id ${vehicle_type_id} not found.` });
        }

        // Verify license_plate uniqueness if provided and different from current
        if (license_plate !== undefined && license_plate !== existingVehicles[0].license_plate) {
            if (!await checkLicensePlateUnique(license_plate, id)) {
                return res.status(409).json({ error: `License plate ${license_plate} already exists.` });
            }
        }

        // Build the update query dynamically
        const fieldsToUpdate = {};
        if (user_id !== undefined) fieldsToUpdate.user_id = user_id;
        if (vehicle_type_id !== undefined) fieldsToUpdate.vehicle_type_id = vehicle_type_id;
        if (make !== undefined) fieldsToUpdate.make = make;
        if (model !== undefined) fieldsToUpdate.model = model;
        if (year !== undefined) fieldsToUpdate.year = year;
        if (license_plate !== undefined) fieldsToUpdate.license_plate = license_plate;
        if (capacity_kg !== undefined) fieldsToUpdate.capacity_kg = capacity_kg;
        if (is_active !== undefined) fieldsToUpdate.is_active = is_active;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ error: 'No valid fields provided for update.' });
        }

        const [result] = await db.query('UPDATE user_vehicles SET ? WHERE id = ?', [fieldsToUpdate, id]);

        if (result.affectedRows === 0) {
            // This case should ideally be caught by the initial check, but as a safeguard:
            return res.status(404).json({ error: 'User vehicle not found or no changes made.' });
        }

        const [updatedVehicles] = await db.query('SELECT * FROM user_vehicles WHERE id = ?', [id]);
        res.status(200).json(updatedVehicles[0]);

    } catch (error) {
        console.error('Error updating user vehicle:', error);
        // Check for specific MySQL errors like duplicate entry if not caught by pre-checks
        if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('license_plate')) {
            return res.status(409).json({ error: 'License plate already exists.', details: error.message });
        }
        res.status(500).json({ error: 'Failed to update user vehicle', details: error.message });
    }
};

exports.deleteUserVehicle = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM user_vehicles WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User vehicle not found' });
        }
        res.status(200).json({ message: 'User vehicle deleted successfully' });
        // Or res.status(204).send(); for No Content
    } catch (error) {
        console.error('Error deleting user vehicle:', error);
        res.status(500).json({ error: 'Failed to delete user vehicle', details: error.message });
    }
};