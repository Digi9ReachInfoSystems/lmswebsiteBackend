const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema({
  discount: {
    type: Number,  // Assuming discount is a percentage, so it's a number
    required: true,
    default: 0, // Default value, set to 0 if not provided
  },
  gst: {
    type: Number,  // GST can be a percentage too
    required: true,
    default: 0, // Default value, set to 0 if not provided
  },
});

module.exports = mongoose.model("Pricing", pricingSchema);
