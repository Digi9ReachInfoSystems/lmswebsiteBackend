const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  classLevel: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  curriculum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true
  },
  image: { type: String,},
  description: { type: String, },
});


module.exports = mongoose.model("Class", classSchema);