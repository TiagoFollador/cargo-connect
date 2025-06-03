const db = require('../../db.js'); // Assuming db.js is in the backend root directory

/**
 * Creates a new vehicle type.
 * @param {object} vehicleTypeData - Data for the new vehicle type.
 * @param {string} vehicleTypeData.name - The name of the vehicle type.
 * * @param {string|null} vehicleTypeData.description - The description of the vehicle type.
 * @param {number|null} vehicleTypeData.capacity_kg - The capacity in kg.
 * @returns {Promise<object>} The created vehicle type object.
 */
async function create(vehicleTypeData) {
    const { name, description, capacity_kg } = vehicleTypeData;
    const [result] = await db.query(
        'INSERT INTO vehicle_types (name, description, capacity_kg) VALUES (?, ?, ?)',
        [name, description, capacity_kg] // Assumes capacity_kg is already number or null
    );
    return { id: result.insertId, name, description, capacity_kg };
}

/**
 * Retrieves all vehicle types.
 * @returns {Promise<Array<object>>} A list of all vehicle types.
 */
async function findAll() {
    const [types] = await db.query('SELECT id, name, description, capacity_kg, created_at, updated_at FROM vehicle_types');
    return types;
}

/**
 * Retrieves a single vehicle type by its ID.
 * @param {number} id - The ID of the vehicle type.
 * @returns {Promise<object|null>} The vehicle type object or null if not found.
 */
async function findById(id) {
    const [types] = await db.query('SELECT id, name, description, capacity_kg, created_at, updated_at FROM vehicle_types WHERE id = ?', [id]);
    return types.length > 0 ? types[0] : null;
}

/**
 * Updates an existing vehicle type.
 * @param {number} id - The ID of the vehicle type to update.
 * @param {object} dataToUpdate - An object containing the fields to update.
 * @returns {Promise<object|null>} The updated vehicle type object, or null if not found.
 */
async function update(id, dataToUpdate) {
    if (Object.keys(dataToUpdate).length === 0) {
        return findById(id); // No changes, return current state if exists
    }
    const [result] = await db.query('UPDATE vehicle_types SET ? WHERE id = ?', [dataToUpdate, id]);
    if (result.affectedRows > 0) {
        return findById(id); // Fetch and return the updated record
    }
    return null; // Indicates vehicle type not found for update
}

/**
 * Deletes a vehicle type by its ID.
 * @param {number} id - The ID of the vehicle type to delete.
 * @returns {Promise<number>} The number of affected rows (0 or 1).
 */
async function remove(id) {
    const [result] = await db.query('DELETE FROM vehicle_types WHERE id = ?', [id]);
    return result.affectedRows;
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove,
};