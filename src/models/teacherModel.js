const mongoose = require("mongoose");
const { profile } = require("winston");

const teacherSchema = new mongoose.Schema({
  auth_id: { type: String, unique: true },
  teacher_id: { 
    type: String, 
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  role: { type: String, enum: ["teacher", "admin"], required: true },
  board_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },

  attendance: [
    {
      clock_in_time: { type: Date },
      clock_out_time: { type: Date },
      Date: { type: Date },
      Meeting_attended: { type: Boolean },
      meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
      Meeting_completed: { type: Boolean },
      meeting_title: { type: String },
    },
  ],
  class_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
  ],

  qualifications: { type: String },
  dateOfBirth: { type: Date },
  bio: { type: String },
  approval_status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  schedule: [
    {
      date: { type: Date },
      meeting_url: { type: String },
      meeting_title: { type: String },
      clock_in_time: { type: Date },
      clock_out_time: { type: Date },
      meeting_completed: { type: Boolean },
      meeting_time: { type: String },
      meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
      meeting_reschedule: { type: Boolean , default: false },
    },
  ],
  resume_link: { type: String },
  profile_image: { type: String },
  payout_info: { type: String },

  subject: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  microsoft_id: {
    type: String,
  },
  microsoft_password: {
    type: String,
  },
  microsoft_principle_name: {
    type: String,
  },

  last_online: { type: Date, default: Date.now },
  experience: { type: String },
  no_of_classes: { type: Number },
  phone_number: { type: String },
  worked_hours: {
    type: Number,
  },
  available_time: { type: String },
  language: { type: String },
  is_grammar_teacher: { type: Boolean, default: false },
});

module.exports = mongoose.model("Teacher", teacherSchema);
