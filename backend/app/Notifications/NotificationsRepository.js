const db = require('../../db.js');
const UserRepository = require('../Users/UserRepository'); // To check if user_id exists

const VALID_NOTIFICATION_TYPES = ['shipment_update', 'offer_received', 'offer_accepted', 'offer_rejected', 'system_alert', 'payment'];
const VALID_RELATED_ENTITY_TYPES = ['shipment', 'offer', 'contract', 'user', null]; // Added null as it's nullable

/**
 * Creates a new notification.
 * POST /api/notifications
 */
exports.createNotification = async (req, res) => {
    const {
        user_id, title, message, type, related_entity_type, related_entity_id
    } = req.body;

    // Basic validation
    if (user_id === undefined || !title || !message || !type) {
        return res.status(400).json({ error: 'Missing required fields: user_id, title, message, type are required.' });
    }
    if (typeof user_id !== 'number' || !Number.isInteger(user_id) || user_id <= 0) {
        return res.status(400).json({ error: 'user_id must be a positive integer.' });
    }
    if (!VALID_NOTIFICATION_TYPES.includes(type)) {
        return res.status(400).json({ error: `Invalid type. Must be one of: ${VALID_NOTIFICATION_TYPES.join(', ')}` });
    }
    if (related_entity_type !== undefined && !VALID_RELATED_ENTITY_TYPES.includes(related_entity_type)) {
        return res.status(400).json({ error: `Invalid related_entity_type. Must be one of: ${VALID_RELATED_ENTITY_TYPES.filter(t => t !== null).join(', ')} or null.` });
    }
    if (related_entity_id !== undefined && related_entity_id !== null && (typeof related_entity_id !== 'number' || !Number.isInteger(related_entity_id) || related_entity_id <= 0)) {
        return res.status(400).json({ error: 'related_entity_id must be a positive integer or null.' });
    }
    if (related_entity_type === null && related_entity_id !== null) {
        return res.status(400).json({ error: 'related_entity_id must be null if related_entity_type is null.' });
    }
    if (related_entity_type !== null && related_entity_id === null) {
        return res.status(400).json({ error: 'related_entity_id cannot be null if related_entity_type is provided.' });
    }

    try {
        // Check if user exists
        const userExists = await UserRepository.findUserById(user_id);
        if (!userExists) {
            return res.status(404).json({ error: `User with id ${user_id} not found.` });
        }

        // Note: We are not checking if related_entity_id actually exists in its respective table.
        // This could be added for more robustness if needed.

        const notificationData = {
            user_id,
            title,
            message,
            type,
            related_entity_type: related_entity_type === undefined ? null : related_entity_type,
            related_entity_id: related_entity_id === undefined ? null : related_entity_id,
            is_read: false, // Default to false
            // updated_at will be set by default on creation
        };

        const [result] = await db.query('INSERT INTO notifications SET ?', notificationData);
        const newNotificationId = result.insertId;

        // Fetch the created notification to include created_at and updated_at
        const [createdNotification] = await db.query('SELECT * FROM notifications WHERE id = ?', [newNotificationId]);

        res.status(201).json(createdNotification[0]);

    } catch (error) {
        console.error('Failed to create notification:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2' && error.message.includes('user_id')) {
            return res.status(404).json({ error: `User with id ${user_id} not found.` });
        }
        res.status(500).json({ error: 'Failed to create notification', details: error.message });
    }
};

/**
 * Retrieves all notifications (research function with filters).
 * GET /api/notifications
 * Query params: user_id, type, is_read (true/false), related_entity_type, related_entity_id, created_from, created_to
 */
exports.getAllNotifications = async (req, res) => {
    try {
        let query = 'SELECT * FROM notifications';
        const conditions = [];
        const params = [];

        if (req.query.user_id) {
            conditions.push('user_id = ?');
            params.push(parseInt(req.query.user_id, 10));
        }
        if (req.query.type && VALID_NOTIFICATION_TYPES.includes(req.query.type)) {
            conditions.push('type = ?');
            params.push(req.query.type);
        }
        if (req.query.is_read !== undefined) {
            conditions.push('is_read = ?');
            params.push(req.query.is_read === 'true' || req.query.is_read === true);
        }
        if (req.query.related_entity_type && VALID_RELATED_ENTITY_TYPES.includes(req.query.related_entity_type)) {
            conditions.push('related_entity_type = ?');
            params.push(req.query.related_entity_type);
        }
        if (req.query.related_entity_id) {
            conditions.push('related_entity_id = ?');
            params.push(parseInt(req.query.related_entity_id, 10));
        }
        if (req.query.created_from) {
            conditions.push('created_at >= ?');
            params.push(req.query.created_from); // Assuming YYYY-MM-DD HH:MM:SS format
        }
        if (req.query.created_to) {
            conditions.push('created_at <= ?');
            params.push(req.query.created_to); // Assuming YYYY-MM-DD HH:MM:SS format
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY created_at DESC'; // Default ordering

        const [notifications] = await db.query(query, params);
        res.status(200).json(notifications);

    } catch (error) {
        console.error('Failed to retrieve notifications:', error);
        res.status(500).json({ error: 'Failed to retrieve notifications', details: error.message });
    }
};

/**
 * Retrieves a single notification by its ID.
 * GET /api/notifications/:id
 */
exports.getNotificationById = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const [notifications] = await db.query('SELECT * FROM notifications WHERE id = ?', [parsedId]);
        if (notifications.length > 0) {
            res.status(200).json(notifications[0]);
        } else {
            res.status(404).json({ error: 'Notification not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve notification:', error);
        res.status(500).json({ error: 'Failed to retrieve notification', details: error.message });
    }
};

/**
 * Retrieves all notifications for a specific user and marks them as read.
 * GET /api/notifications/user/:userId
 */
exports.getNotificationsByUserId = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid User ID format. ID must be an integer.' });
    }

    try {
        const userExists = await UserRepository.findUserById(userId);
        if (!userExists) {
            return res.status(404).json({ error: `User with id ${userId} not found.` });
        }

        // Fetch unread notifications first, or all notifications and then mark them
        // For simplicity, fetch all for the user, then mark all fetched as read.
        const [notifications] = await db.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);

        if (notifications.length > 0) {
            const notificationIdsToMarkRead = notifications
                .filter(n => !n.is_read) // Only mark those that are currently unread
                .map(n => n.id);

            if (notificationIdsToMarkRead.length > 0) {
                // Mark them as read and update updated_at
                await db.query(
                    'UPDATE notifications SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id IN (?) AND user_id = ?',
                    [notificationIdsToMarkRead, userId] // Ensure we only update for the correct user
                );
                // Update the is_read status in the objects we are about to return
                notifications.forEach(n => {
                    if (notificationIdsToMarkRead.includes(n.id)) {
                        n.is_read = true;
                        // n.updated_at = new Date(); // Reflect change, though DB has it
                    }
                });
            }
        }

        res.status(200).json(notifications);

    } catch (error) {
        console.error(`Failed to retrieve notifications for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to retrieve or update notifications', details: error.message });
    }
};

/**
 * Updates a notification, e.g., to mark it as read.
 * PUT /api/notifications/:id
 */
exports.updateNotification = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    const { is_read } = req.body; // Primarily for marking as read

    if (is_read === undefined || typeof is_read !== 'boolean') {
        return res.status(400).json({ error: 'Invalid or missing is_read field. It must be a boolean.' });
    }

    try {
        // Check if notification exists
        const [existingNotifications] = await db.query('SELECT id, is_read FROM notifications WHERE id = ?', [parsedId]);
        if (existingNotifications.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Only update if the status is different
        if (existingNotifications[0].is_read === is_read) {
            const [currentNotification] = await db.query('SELECT * FROM notifications WHERE id = ?', [parsedId]);
            return res.status(200).json(currentNotification[0]); // No change, return current state
        }

        const [result] = await db.query(
            'UPDATE notifications SET is_read = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [is_read, parsedId]
        );

        if (result.affectedRows > 0) {
            const [updatedNotification] = await db.query('SELECT * FROM notifications WHERE id = ?', [parsedId]);
            res.status(200).json(updatedNotification[0]);
        } else {
            // Should be caught by the existence check, but as a fallback
            res.status(404).json({ error: 'Notification not found or no change made' });
        }
    } catch (error) {
        console.error('Failed to update notification:', error);
        res.status(500).json({ error: 'Failed to update notification', details: error.message });
    }
};

/**
 * Deletes a notification by its ID.
 * DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const [result] = await db.query('DELETE FROM notifications WHERE id = ?', [parsedId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Notification deleted successfully' });
        } else {
            res.status(404).json({ error: 'Notification not found' });
        }
    } catch (error) {
        console.error('Failed to delete notification:', error);
        res.status(500).json({ error: 'Failed to delete notification', details: error.message });
    }
};