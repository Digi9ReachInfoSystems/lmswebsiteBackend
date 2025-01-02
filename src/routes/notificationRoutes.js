// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
// const authMiddleware = require('../middleware/auth');

// Create a new notification
router.post('/', notificationController.createNotification);

// Get all notifications with optional filters
router.get('/', notificationController.getAllNotifications);

// Get notifications for the authenticated user
router.get('/my/:userId', notificationController.getUserNotifications);

// Get unread notifications for the authenticated user
router.get('/unread/:userId', notificationController.getUnreadNotifications);

// Get a single notification by ID
router.get('/:id', notificationController.getNotificationById);

// Update a notification by ID
router.put('/:id', notificationController.updateNotification);

// Delete a notification by ID
router.delete('/:id', notificationController.deleteNotification);

// Mark a notification as read
router.patch('/mark-as-read/:userId', notificationController.markAsRead);

module.exports = router;
