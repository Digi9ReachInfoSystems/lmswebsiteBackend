// models/UserNotification.js
const mongoose = require("mongoose");

const userNotificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notification_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
    required: true,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Ensure a user cannot have multiple entries for the same notification
userNotificationSchema.index({ user_id: 1, notification_id: 1 }, { unique: true });

module.exports = mongoose.model("UserNotification", userNotificationSchema);
