const mongoose = require("mongoose");
const { isDate, isTime } = require("validator");

const teacherApplicationSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  resume_link: {
    type: String,
    required: true,
  },
  approval_status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  date_applied: {
    type: Date,
    default: Date.now,
  },
  date_approved: {
    type: Date,
  },
  current_position: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },

  profileImage:{
    type: String,
    // required: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
  },
  experience: {
    type: String,
    // required: true,
  }
  // teacher_availability: {
  //   type: Date,
  //   required: true,
  // },
});

module.exports = mongoose.model("TeacherApplication", teacherApplicationSchema);
