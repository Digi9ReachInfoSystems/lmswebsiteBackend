const mongoose = require("mongoose");

const typeOfBatchSchema = new mongoose.Schema({
    mode: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, },
    discountPercentage: { type: Number },
    discountedPrice: { type: Number },
    discount_active: { type: Boolean, default: false },
});

module.exports = mongoose.model("TypeOfBatch", typeOfBatchSchema);