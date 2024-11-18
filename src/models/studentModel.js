const mongoose = require("mongoose");
const { profile } = require("winston");

const studentSchema = new mongoose.Schema({
  auth_id: { type: String, required: true, unique: true },
  // student_id: { type: String, required: true, unique: true },
  // student_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   // required: true,
  //   unique: true,
  // },
  subject_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  subscribed_Package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  is_paid: {
    type: Boolean,
    default: false,
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

  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },

  created_at: { type: Date, default: Date.now },
  last_online: { type: Date, default: Date.now },

  role: { type: String, enum: ["student"], required: true },
});

module.exports = mongoose.model("Student", studentSchema);
