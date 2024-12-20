const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject_name: { type: String, required: true },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subject_image: { type: String },
  created_at: { type: Date, default: Date.now },
  language: { type: String },
  approval_status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  icon:{
    type: String
  },
  teacher_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  ],
  is_grammar_subject: { type: Boolean, default: false },
});

module.exports = mongoose.model("Subject", subjectSchema);
