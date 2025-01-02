const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
  },
  is_all: {
    type: Boolean,
  },
});
module.exports = mongoose.model("Notification", notificationSchema);
