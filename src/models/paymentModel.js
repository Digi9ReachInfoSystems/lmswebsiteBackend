// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema({
//   amount: { type: Number, required: true },
//   created_time: { type: Date, default: Date.now },
//   status: { type: String, default: "paid" },
//   payment_id: { type: String },
//   order_id: { type: String },
//   student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
//   // user_id: {
//   //   // Reference to User model
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: "User", // Ensure this matches the name used in User model
//   //   required: true,
//   // },
//   completed: {
//     type: Boolean,
//   },
//   payment_method: {
//     type: String,
//   },
//   package_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Package",
//   },
// });

// module.exports = mongoose.model("Payment", paymentSchema);


// models/Payment.js

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { 
    type: String, 
    enum: ["created", "paid", "failed", "refunded"], 
    default: "created" 
  },
  payment_id: { type: String, unique: true, sparse: true },
  order_id: { type: String, unique: true, sparse: true },
  razorpay_signature: { type: String },
  receipt: { type: String },
  student_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", 
    required: true 
  },
  package_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Package", 
    required: true 
  },
  payment_method: { type: String },
  description: { type: String },
  refund_id: { type: String }, // Optional
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model("Payment", paymentSchema);
