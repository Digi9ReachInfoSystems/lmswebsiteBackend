const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Reference to Student model
    required: true,
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz', // Reference to Quiz model
    required: true,
  },
  responses: [
    {
      question_number: { type: Number, required: true },
      selected_option_id: { type: Number, required: true },
      is_correct: { type: Boolean, required: true },
      _id: false,
    },
  ],
  score: { type: Number, required: true }, // Total score
  submitted_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Response', responseSchema);
