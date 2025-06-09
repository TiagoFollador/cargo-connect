const express = require('express');
const router = express.Router();
const notificationsRepository = require('./NotificationsRepository');

router.post('/', notificationsRepository.createNotification);

router.get('/', notificationsRepository.getAllNotifications);

router.get('/:id', notificationsRepository.getNotificationById);

router.get('/user/:userId', notificationsRepository.getNotificationsByUserId);

router.put('/:id/read', notificationsRepository.markNotificationAsRead);

router.put('/:id', notificationsRepository.updateNotification);

router.delete('/:id', notificationsRepository.deleteNotification);

module.exports = router;