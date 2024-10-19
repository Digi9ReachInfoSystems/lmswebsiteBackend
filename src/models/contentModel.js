const mongoose = require('mongoose');
const { Schema } = mongoose;

const contentSchema = new Schema(
  {
    batch: {
      _id: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
      batch_name: { type: String, required: true },
    },
    teacher_id: {type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    
    material_link: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^https?:\/\/.+/.test(v), // Validate URL format
        message: 'Invalid URL format!',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
