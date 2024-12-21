

const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  submission_date: {
    type: Date,
    default: Date.now,
  },
  response_url: {
    type: String,
    required: true,
  },
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
  batch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true,
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  content_url: {
    type: String,
    required: true,
  },
  expiry_date: {
    type: Date,
    required: true,
  },
  responses: [responseSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Assignment', assignmentSchema);
