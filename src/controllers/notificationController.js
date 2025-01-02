// controllers/notificationController.js
const Notification = require('../models/notificationModel');
const User = require('../models/userModel');
const UserNotification = require('../models/userNotificationModel'); // Optional: For tracking read status
const mongoose = require('mongoose');
/**
 * Create a new notification
 * POST /notifications/
 */
exports.createNotification = async (req, res) => {
  try {
    const { user_ids, message, title, is_all } = req.body;

    // Validation: Ensure 'message' is provided
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // If not a global notification, ensure 'user_ids' is provided and valid
    if (!is_all) {
      if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
        return res.status(400).json({ error: 'user_ids must be a non-empty array unless is_all is true.' });
      }

      // Validate that all user_ids exist
      const validUsers = await User.find({ _id: { $in: user_ids } });
      if (validUsers.length !== user_ids.length) {
        return res.status(400).json({ error: 'One or more user_ids are invalid.' });
      }
    }

    // Create the notification
    const notification = new Notification({
      user_id: is_all ? [] : user_ids,
      message,
      title,
      is_all: is_all || false,
    });

    const savedNotification = await notification.save();

    // If not a global notification, create UserNotification entries
    if (!is_all) {
      // Create UserNotification entries
      const userNotifications = user_ids.map(userId => ({
        user_id: userId,
        notification_id: savedNotification._id,
      }));
      await UserNotification.insertMany(userNotifications);
    }

    res.status(201).json(savedNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Get all notifications
 * GET /notifications/
 * Query Params: user_id (optional), is_all (optional)
 */
exports.getAllNotifications = async (req, res) => {
  try {
    const { user_id, is_all } = req.query;

    let filter = {};

    if (user_id) {
      filter = {
        $or: [
          { user_id: user_id },
          { is_all: true },
        ],
      };
    } else if (is_all) {
      filter = { is_all: is_all === 'true' };
    }

    const notifications = await Notification.find(filter)
      .populate('user_id', 'name email') // Adjust fields as necessary
      .sort({ date: -1 }); // Latest first

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Get notifications for the authenticated user
 * GET /notifications/my
 */
exports.getUserNotifications = async (req, res) => {
  try {
    
    const userId = req.params.userId;

    // Fetch notifications that are either global or specifically for the user
    const notifications = await Notification.find({
      $or: [
        { user_id: userId },
        { is_all: true },
      ],
    })
      .populate('user_id', 'name email')
      .sort({ date: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Get a single notification by ID
 * GET /notifications/:id
 */
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id)
      .populate('user_id', 'name email');

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Update a notification by ID
 * PUT /notifications/:id
 */
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_ids, message, title, is_all } = req.body;

    // Find the existing notification
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    // Update fields if provided
    if (message !== undefined) notification.message = message;
    if (title !== undefined) notification.title = title;
    if (is_all !== undefined) notification.is_all = is_all;

    // Handle user_ids update if not a global notification
    if (!notification.is_all) {
      if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
        return res.status(400).json({ error: 'user_ids must be a non-empty array unless is_all is true.' });
      }

      // Validate that all user_ids exist
      const validUsers = await User.find({ _id: { $in: user_ids } });
      if (validUsers.length !== user_ids.length) {
        return res.status(400).json({ error: 'One or more user_ids are invalid.' });
      }

      // Update user_ids in Notification
      notification.user_id = user_ids;

      // Update UserNotification entries
      // Remove existing entries not in the new user_ids
      await UserNotification.deleteMany({
        notification_id: id,
        user_id: { $nin: user_ids },
      });

      // Add new UserNotification entries for new user_ids
      const existingUserNotifications = await UserNotification.find({
        notification_id: id,
        user_id: { $in: user_ids },
      }).select('user_id');

      const existingUserIds = existingUserNotifications.map(un => un.user_id.toString());

      const newUserNotifications = user_ids
        .filter(userId => !existingUserIds.includes(userId.toString()))
        .map(userId => ({
          user_id: userId,
          notification_id: id,
        }));

      if (newUserNotifications.length > 0) {
        await UserNotification.insertMany(newUserNotifications);
      }
    } else {
      // If updating to global notification, remove all UserNotification entries
      await UserNotification.deleteMany({ notification_id: id });
      notification.user_id = [];
    }

    const updatedNotification = await notification.save();

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Delete a notification by ID
 * DELETE /notifications/:id
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    // Optionally, delete related UserNotification entries
    await UserNotification.deleteMany({ notification_id: id });

    res.status(200).json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Mark a notification as read for the authenticated user
 * PATCH /notifications/mark-as-read
 * Body Params: notification_id
 */
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { notification_id } = req.body;

    if (!notification_id) {
      return res.status(400).json({ error: 'notification_id is required.' });
    }

    // Check if the notification exists and is relevant to the user
    const notification = await Notification.findById(notification_id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    const isRelevant = notification.is_all || notification.user_id.includes(userId);
    if (!isRelevant) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Find or create the UserNotification document
    let userNotification = await UserNotification.findOne({ user_id: userId, notification_id });

    if (!userNotification) {
      userNotification = new UserNotification({ user_id: userId, notification_id });
    }

    userNotification.is_read = true;
    await userNotification.save();
    

    res.status(200).json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Get unread notifications for the authenticated user
 * GET /notifications/unread
 */
exports.getUnreadNotifications = async (req, res) => {
  try {
    const userId =new mongoose.Types.ObjectId(req.params.userId); 

    // Find all notifications relevant to the user
    const notifications = await Notification.find({
      $or: [
        { user_id: userId },
        { is_all: true },
      ],
    }).populate('user_id', 'name email').sort({ date: -1 });

    // Find UserNotification entries where is_read is false
    const unreadUserNotifications = await UserNotification.find({
      user_id: userId,
      is_read: false,
      notification_id: { $in: notifications.map(n => n._id) },
    }).select('notification_id');

    // Extract unread notification IDs
    const unreadNotificationIds = unreadUserNotifications.map(un => un.notification_id.toString());

    // Filter notifications to only include unread ones
    const unreadNotifications = notifications.filter(n => unreadNotificationIds.includes(n._id.toString()));

    res.status(200).json(unreadNotifications);
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
