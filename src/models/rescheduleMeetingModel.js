// models/rescheduleMeetingModel.js

const mongoose = require("mongoose");

const rescheduleMeetingSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  batch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
  meeting_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
  },
  meeting_title: {
    type: String,
    required: true,
    maxlength: 100, // Optional: Limit the length of the title
  },
  meeting_description: {
    type: String,
    maxlength: 500, // Optional: Limit the length of the description
  },
  status: {
    type: String,
    enum: ["approved", "rejected", "pending"],
    default: "pending",
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Optional: Add indexes for frequently queried fields
// rescheduleMeetingSchema.index({ teacher_id: 1 });
// rescheduleMeetingSchema.index({ student_id: 1 });
// rescheduleMeetingSchema.index({ batch_id: 1 });
// rescheduleMeetingSchema.index({ status: 1 });

const RescheduleMeeting = mongoose.model("RescheduleMeeting", rescheduleMeetingSchema);

module.exports = RescheduleMeeting;
