const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  batch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },

  meeting_link: {
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
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
  ],
});
module.exports = mongoose.model("Meeting", meetingSchema);
