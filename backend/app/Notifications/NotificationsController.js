const express = require('express');
const router = express.Router();
const notificationsRepository = require('./NotificationsRepository');

// Create a new notification
// POST /api/notifications
router.post('/', notificationsRepository.createNotification);

// Get all notifications (research function with filters)
// GET /api/notifications
router.get('/', notificationsRepository.getAllNotifications);

// Get a single notification by ID
// GET /api/notifications/:id
router.get('/:id', notificationsRepository.getNotificationById);

// Get all notifications for a specific user and mark them as read
// GET /api/notifications/user/:userId
router.get('/user/:userId', notificationsRepository.getNotificationsByUserId);

// Update a notification (e.g., mark as read)
// PUT /api/notifications/:id
router.put('/:id', notificationsRepository.updateNotification);

// Delete a notification by ID
// DELETE /api/notifications/:id
router.delete('/:id', notificationsRepository.deleteNotification);

module.exports = router;