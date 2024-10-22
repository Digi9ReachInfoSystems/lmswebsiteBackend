const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackSchema = new Schema(
  {
    teacher_id: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher', // Reference to the Teacher model (user_id)
      required: true,
    },
    student_id: {
      type: Schema.Types.ObjectId,
      ref: 'Student', // Reference to the Student model (student_id)
      required: true,
    },
    batch_id: {
      type: Schema.Types.ObjectId,
      ref: 'Batch', // Reference to the Batch model
      required: true,
    },
    feedback_text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically creates createdAt and updatedAt fields
);

module.exports = mongoose.model('Feedback', feedbackSchema);
