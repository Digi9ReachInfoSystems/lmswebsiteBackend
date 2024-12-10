const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  package_name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  board_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  subject_id:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  }],
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  mode:{
    type: String ,
    enum:['normal','personal'],
    default:'normal'
  },
 duration: {
    type: Number,
  },
});

module.exports = mongoose.model("Package", packageSchema);
