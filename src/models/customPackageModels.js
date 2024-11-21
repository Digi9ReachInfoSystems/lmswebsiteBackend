// src/models/customPackageModels.js

const mongoose = require("mongoose");

const customPackageSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  expiry_date: {
    type: Date,
  },
  is_active: {
    type: Boolean,
  },
  is_approved: {
    type: Boolean,
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  package_price: {
    type: Number, // Price agreed upon for the package
    default: 0,
  },
  is_price_finalized: {
    type: Boolean, // Indicates if the price has been finalized
    default: false,
  },
  admin_contacted: {
    type: Boolean, // Indicates if the admin has contacted the student
    default: false,
  },
  admin_notes: {
    type: String, // Any notes from the admin
  },
  subject_id: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Subject",
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 3;
      },
      message: "At least 3 subjects are required.",
    },
  },
  slots: { type:String},
});

module.exports = mongoose.model("CustomPackage", customPackageSchema);
