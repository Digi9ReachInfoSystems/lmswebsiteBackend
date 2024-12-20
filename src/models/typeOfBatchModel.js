const mongoose = require("mongoose");

const typeOfBatchSchema = new mongoose.Schema({
    mode: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, },
    title: { type: String, required: true },
    discountPercentage: { type: Number },
    discountedPrice: { type: Number },
    discount_active: { type: Boolean, default: false },
    feature:[{
        type: String
    }]
});

module.exports = mongoose.model("TypeOfBatch", typeOfBatchSchema);