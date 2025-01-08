const mongoose = require("mongoose");
const { profile } = require("winston");

const studentSchema = new mongoose.Schema({
  auth_id: { type: String, required: true, unique: true },
  // student_id: { type: String, required: true, unique: true },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
    unique: true,
  },
  subject_id: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
      batch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
      },
      batch_assigned: { type: Boolean },
      batch_expiry_date: { type: Date },
      batch_status: {
        type: String,
        enum: ["active", "expired", "new"],
        default: "new",
      },
      duration: { type: Number },
      type_of_batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TypeOfBatch",
      },
    },
   
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  type_of_batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TypeOfBatch",
  },
  duration: { type: String },
  amount: { type: Number },

  subscribed_Package: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package"
    },
    is_active: { type: Boolean },
  }],
  is_paid: {
    type: Boolean,
    default: false
  },
  subscription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  phone_number: { type: String },
  profile_image: { type: String },
  gender: { type: String },
  dateOfBirth: { type: Date },
  board_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board"
  },

  payment_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  }],
  custom_package_id: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomPackage",
    },
    is_active: { type: Boolean },
  }],
  package_expiry: { type: Date },
  custom_package_expiry: { type: Date },
  custom_package_status: {
    type: String,
    enum: ["pending", "approved", "rejected", "no_package", "expired"],
    default: "no_package",
  },
  batch_creation: [{
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    status: {
      type: Boolean,

    }
  }
  ],
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
      meeting_reschedule: { type: Boolean, default: false },
      teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
      batch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
    },
  ],
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
  worked_hours: {
    type: Number,
  },
  mode: {
    type: String,
    enum: ['normal', 'personal'],
    default: 'normal'
  },
  created_at: { type: Date, default: Date.now },
  last_online: { type: Date, default: Date.now },

  role: { type: String, enum: ["student"], required: true },
});

module.exports = mongoose.model("Student", studentSchema);
