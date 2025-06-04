// c:\codigos\experiencia criativa\cargo-connect\backend\routes\Users\UserRepository.js
const db = require('../../db.js');
const bcrypt = require('bcrypt');

const createUserInTransaction = async (userData, hashedPassword, connection) => {
    const { email, name, phone, profile_picture_url } = userData;
    const [userResult] = await connection.query(
        'INSERT INTO users (email, password, name, phone, profile_picture_url) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, name, phone, profile_picture_url || null]
    );
    return userResult.insertId;
};

const assignRoleInTransaction = async (userId, roleId, connection) => {
    await connection.query(
        'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
        [userId, roleId]
    );
};

const findAllUsers = async () => {
    const query = `
        SELECT 
            u.id, u.email, u.name, u.phone, u.profile_picture_url, 
            u.rating, u.trips_completed, u.last_login, u.created_at, u.updated_at,
            ur.role_id, r.name AS role_name
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id;
    `;
    const [rows] = await db.query(query);
    return rows;
};

const findUserById = async (userId) => {
    const query = `
        SELECT 
            u.id, u.email, u.name, u.phone, u.profile_picture_url, 
            u.rating, u.trips_completed, u.last_login, u.created_at, u.updated_at,
            ur.role_id, r.name AS role_name
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.id = ?;
    `;
    const [rows] = await db.query(query, [userId]);
    return rows[0]; // Returns undefined if not found
};

const updateUser = async (userId, updateFields) => {
    if (Object.keys(updateFields).length === 0) {
        return { affectedRows: 0, changedRows: 0 };
    }
    const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateFields), userId];

    const [result] = await db.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);
    return result;
};

const checkUserExistsInTransaction = async (userId, connection) => {
    const [userRows] = await connection.query('SELECT id FROM users WHERE id = ?', [userId]);
    return userRows.length > 0;
};

const checkRoleExistsInTransaction = async (roleId, connection) => {
    const [roleRows] = await connection.query('SELECT id FROM roles WHERE id = ?', [roleId]);
    return roleRows.length > 0;
};

const replaceUserRoleInTransaction = async (userId, roleId, connection) => {
    await connection.query(
        'REPLACE INTO user_roles (user_id, role_id) VALUES (?, ?)',
        [userId, roleId]
    );
};

const deleteUser = async (userId) => {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);
    return result;
};

const getUserProfile = async (userId) => {
    const userQuery = `
        SELECT
            u.id AS userId,
            u.name,
            u.email,
            u.profile_picture_url AS profilePictureUrl,
            u.rating,
            u.trips_completed AS tripsCompleted
        FROM users u
        WHERE u.id = ?;
    `;

    const rolesQuery = `
        SELECT r.name FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = ?;
    `;

    const notificationsQuery = `
        SELECT COUNT(*) AS unreadCount
        FROM notifications
        WHERE user_id = ? AND is_read = FALSE;
    `;

    const [userRows] = await db.query(userQuery, [userId]);
    if (userRows.length === 0) return null;

    const [roleRows] = await db.query(rolesQuery, [userId]);
    const [notificationRows] = await db.query(notificationsQuery, [userId]);

    return {
        ...userRows[0],
        roles: roleRows.map(r => r.name),
        notificationsCount: notificationRows[0].unreadCount
    };
};



module.exports = {
    createUserInTransaction,
    assignRoleInTransaction,
    findAllUsers,
    findUserById,
    getUserProfile,
    updateUser,
    checkUserExistsInTransaction,
    checkRoleExistsInTransaction,
    replaceUserRoleInTransaction,
    deleteUser,
};
