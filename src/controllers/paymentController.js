// // src/controllers/paymentController.js

// const mongoose = require("mongoose"); // Ensure mongoose is imported
// const Payment = require("../models/paymentModel");
// const { v4: uuidv4 } = require("uuid"); // Use destructuring for clarity

// const Student = require("../models/studentModel");

// // Create a new payment
// exports.createPayment = async (req, res) => {
//   const { amount, student_id, package_id, payment_method } = req.body;
//   const payment_id = uuidv4(); // Use uuidv4 for generating unique payment IDs
//   try {
//     const newPayment = new Payment({
//       amount,
//       payment_id,
//       student_id,
//       package_id,
//       payment_method,
//       is_paid: false,
//     });
//     const savedPayment = await newPayment.save();
//     res.status(201).json(savedPayment);
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Delete a payment by ID
// exports.deletePayment = async (req, res) => {
//   try {
//     const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
//     if (!deletedPayment)
//       return res.status(404).json({ message: "Payment not found" });
//     res.status(200).json({ message: "Payment deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting payment:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all payments with optional filters
// exports.getAllPayments = async (req, res) => {
//   const { student_id, payment_id, page = 1, limit = 10 } = req.query;

//   console.log("Received getAllPayments request with:", req.query); // Debug log

//   // Build the filter object based on provided query parameters
//   let filter = {};
//   if (student_id) {
//     if (!mongoose.Types.ObjectId.isValid(student_id)) {
//       console.log("Invalid student_id format:", student_id); // Debug log
//       return res.status(400).json({ error: "Invalid student ID format" });
//     }
//     filter.student_id = student_id;
//   }
//   if (payment_id) {
//     filter.payment_id = payment_id;
//   }

//   console.log("Filter applied:", filter); // Debug log

//   try {
//     const payments = await Payment.find(filter)
//       .populate({
//         path: "student_id",
//         populate: {
//           path: "user_id",
//           select: "name", // Only select the 'name' field from User
//         },
//       })
//       .populate("package_id", "package_name") // Populate package details
//       .skip((page - 1) * limit) // Pagination
//       .limit(parseInt(limit))
//       .exec();

//     const total = await Payment.countDocuments(filter); // Total count for pagination

//     console.log("Fetched payments:", payments); // Debug log

//     res.status(200).json({
//       total,
//       page: parseInt(page),
//       pageSize: payments.length,
//       payments,
//     });
//   } catch (error) {
//     console.error("Error fetching payments:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Get payment details by payment_id
// exports.getPaymentDetails = async (req, res) => {
//   const { payment_id } = req.params;
//   try {
//     const payment = await Payment.findOne({ payment_id })
//       .populate({
//         path: "student_id",
//         populate: {
//           path: "user_id",
//           select: "name",
//         },
//       })
//       .populate({
//         path: "package_id",
//         populate: {
//           path: "package_name",
//         },
//       })
//       .exec();
//     if (!payment) {
//       return res.status(404).json({ error: "Payment not found" });
//     }
//     res.status(200).json(payment);
//   } catch (error) {
//     console.error("Error fetching payment details:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// controllers/paymentController.js

const razorpayInstance = require('../services/razorpayService');
const crypto = require('crypto');
const Payment = require('../models/paymentModel');
const Student = require('../models/studentModel');
const Package = require('../models/packagesModel');

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  const { studentId, packageId, amount, description } = req.body;

  // Validate input
  if (!studentId || !packageId || !amount) {
    return res.status(400).json({ error: 'Missing required fields: studentId, packageId, amount' });
  }

  try {
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if package exists
    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Create Razorpay order
    const orderOptions = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture
      notes: {
        student_id: studentId,
        package_id: packageId,
        description: description || 'Payment for course package'
      },
    };

    const order = await razorpayInstance.orders.create(orderOptions);

    // Save order details in Payment model
    const payment = new Payment({
      amount: amount,
      currency: order.currency,
      status: 'created',
      order_id: order.id,
      student_id: studentId,
      package_id: packageId,
      description: description || 'Payment for course package',
      receipt: order.receipt
    });

    await payment.save();

    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Unable to create order' });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  // Validate input
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required payment details' });
  }

  try {
    const payment = await Payment.findOne({ order_id: razorpay_order_id });

    if (!payment) {
      return res.status(400).json({ error: 'Payment not found' });
    }

    // Generate signature to verify
    const generated_signature = crypto
      .createHmac('sha256', razorpayInstance.key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Update payment details
      payment.payment_id = razorpay_payment_id;
      payment.razorpay_signature = razorpay_signature;
      payment.status = 'paid';
      await payment.save();

      // Add package to student's purchased courses and payment reference
      // await Student.findByIdAndUpdate(payment.student_id, {
      //   $addToSet: { subscribed_Package: payment.package_id, payment_id: payment._id , is_paid: true },
      // });
       await Student.findByIdAndUpdate(payment.student_id, {
         subscribed_Package: payment.package_id, payment_id: payment._id , is_paid: true ,
      });

      res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      // Invalid signature
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Handle Webhook (Optional but Recommended)
exports.handleWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const receivedSignature = req.headers['x-razorpay-signature'];
  const payload = req.body; // Already in raw format due to middleware

  // Generate signature
  const generatedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(payload))
    .digest('hex');

  if (generatedSignature !== receivedSignature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = payload.event;
  const paymentEntity = payload.payload.payment.entity;

  if (event === 'payment.captured') {
    try {
      const payment = await Payment.findOne({ order_id: paymentEntity.order_id });

      if (payment && payment.status !== 'paid') {
        payment.payment_id = paymentEntity.id;
        payment.razorpay_signature = paymentEntity.signature || paymentEntity.id; // Adjust as per actual data
        payment.status = 'paid';
        await payment.save();

        // Update student's purchased courses and add payment reference
        await Student.findByIdAndUpdate(payment.student_id, {
          $addToSet: { subscribed_Package: payment.package_id, payment_id: payment._id , is_paid: true},
        });
      }

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    // Handle other event types if necessary
    res.status(200).json({ status: 'ok' });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
    .populate({
      path: 'student_id',
      populate: { path: "user_id", select: "name email" },
    })
    .populate("package_id");
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};