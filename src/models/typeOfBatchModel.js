const mongoose = require("mongoose");

const typeOfBatchSchema = new mongoose.Schema({
    mode: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    title: { type: String, required: true },
    discountPercentage: { type: Number },
    discountedPrice: { type: Number },
    discount_active: { type: Boolean, default: false },
    feature:[{
        type: String
    }],
    custom_batch: { type: Boolean, default: false },
});

module.exports = mongoose.model("TypeOfBatch", typeOfBatchSchema);