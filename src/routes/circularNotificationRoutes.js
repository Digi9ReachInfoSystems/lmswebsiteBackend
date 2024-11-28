// src/routes/circularNotificationRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const circularNotificationController = require("../controllers/circularNotificationsController");
const upload = require("../middlewares/uploadMiddleware");
// Create a new circular notification (Admin only)
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  authorizeRole("admin"),
  circularNotificationController.createCircularNotification
);

// Get all circular notifications (Authenticated users)
router.get(
  "/all",
  authMiddleware,
  circularNotificationController.getAllCircularNotifications
);

// Update a circular notification by ID (Admin only)
router.put(
  "/:id",
  authMiddleware,
  authorizeRole("admin"),
  circularNotificationController.updateCircularNotification
);

// // Delete a circular notification by ID (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("admin"),
  circularNotificationController.deleteCircularNotification
);

module.exports = router;
