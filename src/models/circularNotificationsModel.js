const mongoose = require("mongoose");

const circularNotificationsSchema = new mongoose.Schema({
  circularName: {
    type: String,
    required: true,
  },
  validDate: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "all"],
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model(
  "CircularNotifications",
  circularNotificationsSchema
);
