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
const CustomPackage = require('../models/customPackageModels');
const nodemailer = require('nodemailer');
const axios = require('axios');



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

exports.verifyPayment = async (req, res) => {
  const signature = req.headers['x-razorpay-signature']; // Signature sent by Razorpay
  const secrete='FPs-kRnkuFXq8tG-course-Payment'
  const generated_signature = crypto.createHmac('sha256', secrete);
  generated_signature.update(JSON.stringify(req.body));
  const digested_signature = generated_signature.digest('hex'); 

  if (digested_signature === signature) {
          console.log("Hello World",req.body);
  } else {

  }

  res.json({ status: "ok" });
}


// Verify Payment
// exports.verifyPayment = async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//   } = req.body;

//   // Validate input
//   if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//     return res.status(400).json({ error: 'Missing required payment details' });
//   }

//   try {
//     const payment = await Payment.findOne({ order_id: razorpay_order_id });

//     if (!payment) {
//       return res.status(400).json({ error: 'Payment not found' });
//     }

//     // Generate signature to verify
//     const generated_signature = crypto
//       .createHmac('sha256', razorpayInstance.key_secret)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest('hex');

//     if (generated_signature === razorpay_signature) {
//       // Update payment details
//       payment.payment_id = razorpay_payment_id;
//       payment.razorpay_signature = razorpay_signature;
//       payment.status = 'paid';
//       await payment.save();

//       // Add package to student's purchased courses and payment reference
//       // await Student.findByIdAndUpdate(payment.student_id, {
//       //   $addToSet: { subscribed_Package: payment.package_id, payment_id: payment._id , is_paid: true },
//       // });
//       await Student.findByIdAndUpdate(payment.student_id, {
//         subscribed_Package: payment.package_id, payment_id: payment._id, is_paid: true,
//       });

//       res.status(200).json({ message: 'Payment verified successfully' });
//     } else {
//       // Invalid signature
//       payment.status = 'failed';
//       await payment.save();
//       res.status(400).json({ error: 'Invalid signature' });
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

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
          $addToSet: { subscribed_Package: payment.package_id, payment_id: payment._id, is_paid: true },
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



// // API to create Razorpay order
// exports.createCustomPackageOrder = async (req, res) => {
//   const { amount, student_email, package_id } = req.body;

//   try {
//     // Create Razorpay order
//     const order = await razorpayInstance.orders.create({
//       amount: amount * 100, // Amount in paise (1 INR = 100 paise)
//       currency: 'INR',
//       receipt: `receipt_${Math.floor(Math.random() * 1000)}`,
//       payment_capture: 1,
//     });

//     // Save payment info to the database
//     const payment = new Payment({
//       amount: amount,
//       status: 'created',
//       order_id: order.id,
//       package_id,
//       student_email,
//     });

//     await payment.save();

//     // Create payment link
//     const paymentLink = `https://checkout.razorpay.com/v1/checkout.js?razorpay_payment_link=${order.id}`;

//     // Send email with payment link
//     const mailOptions = {
//       from: 'your-email@gmail.com', // Sender email address
//       to: student_email,           // Recipient's email (student's email)
//       subject: 'Complete Your Payment for the Custom Package',
//       text: `Dear Student,

//       Please complete your payment for the Custom Package. Click the following link to make your payment:

//       ${paymentLink}

//       Thank you!`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log('Error sending email:', error);
//         return res.status(500).json({ success: false, message: 'Error sending payment link email' });
//       } else {
//         console.log('Email sent: ' + info.response);
//       }
//     });

//     // Respond with success
//     res.json({
//       success: true,
//       orderId: order.id,
//       message: 'Payment link sent to the student email.',
//     });
//   } catch (error) {
//     console.error('Error creating Razorpay order or sending email:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.verifyCustomPackagePayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const secret = razorpayInstance.key_secret;
  const generated_signature = crypto.createHmac('sha256', secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    // Payment is verified
    const payment = await Payment.findOne({ order_id: razorpay_order_id });

    if (payment) {
      payment.status = 'paid';
      payment.payment_id = razorpay_payment_id;
      await payment.save();

      // Optionally update the related package and student
      const customPackage = await CustomPackage.findOne({ _id: payment.package_id });
      if (customPackage) {
        customPackage.is_active = true;
        await customPackage.save();
      }

      const student = await Student.findOne({ email: payment.student_email });
      if (student) {
        student.custom_package_status = 'approved';
        await student.save();
      }

      res.json({ success: true, message: 'Payment verified and recorded' });
    } else {
      res.status(404).json({ success: false, message: 'Payment record not found' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
};

exports.customPackageWebhookHandle = (req, res) => {
  const webhookSecret = 'your_webhook_secret'; // Replace this with your Razorpay Webhook Secret
  const signature = req.headers['x-razorpay-signature']; // Signature sent by Razorpay
  const body = JSON.stringify(req.body);

  // Verify the webhook signature
  const generatedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (generatedSignature === signature) {
    // Webhook signature is valid
    const event = req.body;

    // Check for payment captured event
    if (event.event === 'payment.captured') {
      console.log('Payment Captured:', event.payload);
      const payment = event.payload.payment.entity;
      // const student_id = payment.notes.student_id;
      // const package_id = payment.notes.package_id;

      // // You can now use student_id and package_id for further processing
      // console.log('Payment Captured:', payment);
      // console.log('Student ID:', student_id);
      // console.log('Package ID:', package_id);

      // You can update the student's payment status, notify the student, or perform other actions
      // For example, mark the student as 'paid' in your database or update the package record

      // Example: update the payment status in your database
      // await Student.updateOne({ _id: student_id }, { paymentStatus: 'paid' });

      // Respond with a 200 status to acknowledge the receipt of the webhook
      return res.status(200).send('Event received');
    } else {
      // Handle other events (e.g., payment.failed, payment.refunded)
      return res.status(200).send('Event received');
    }
  } else {
    // If signature doesn't match, respond with 400 Bad Request
    console.error('Invalid signature');
    return res.status(400).send('Invalid signature');
  }
};



// (req, res) => {
//   const webhookSignature = req.headers['x-razorpay-signature'];
//   const body = req.body;

//   // Generate signature to verify the payload
//   const generatedSignature = crypto.createHmac('sha256', webhookSecret)
//     .update(body)
//     .digest('hex');

//   if (webhookSignature === generatedSignature) {
//     // Process the webhook payload
//     const paymentData = body.payload.payment.entity;
//     console.log(paymentData);
//     // Update the payment status in the database
//     Payment.findOne({ order_id: paymentData.order_id })
//       .then((payment) => {
//         if (payment) {
//           payment.status = 'paid';
//           payment.payment_id = paymentData.id;
//           payment.save();
//           res.status(200).send('Payment verified and status updated');
//         } else {
//           res.status(404).send('Payment record not found');
//         }
//       })
//       .catch((err) => res.status(500).send('Error updating payment status'));
//   } else {
//     res.status(400).send('Invalid signature');
//   }
// };


exports.createCustomPackageOrder = async (req, res) => {
  const { amount, student_email, package_id, student_id } = req.body;
  try {
    // Create Razorpay order
    // Validate input
    if (!student_id || !package_id || !amount) {
      return res.status(400).json({ error: 'Missing required fields: studentId, packageId, amount' });
    }
    // Check if student exists
    const student = await Student.findById(student_id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    // Check if package exists
    const package = await CustomPackage.findById(package_id);
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
      // Create Razorpay order

    }
    const orderOptions = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture
      notes: {
        student_id: student_id,
        package_id: package_id,
        description: 'Payment for course package'
      },
    };
    const order = await razorpayInstance.orders.create(orderOptions);


    // Save order details in Payment model
    const payment = new Payment({
      amount: amount,
      currency: order.currency,
      status: 'created',
      order_id: order.id,
      student_id: student_id,
      custom_package_id: order.notes.package_id,
      description: 'Payment for course package',
      receipt: order.receipt
    });
    // // callback_url: 'https://example-callback-url.com/',
    await payment.save();
    const paymentLinkResponse = await axios.post(
      'https://api.razorpay.com/v1/payment_links',
      {
        amount: amount * 100, // Amount in paise (1 INR = 100 paise)
        currency: 'INR',
        accept_partial: true,
        first_min_partial_amount: 100, // Optional, for partial payments
        expire_by: Math.floor(Date.now() / 1000) + 3600, // Set expiry to 1 hour from now
        reference_id: `TSsd${Math.floor(Math.random() * 1000)}`, // Reference ID for tracking
        description: `Payment for Custom Package - Package ID: ${package_id}`,
        customer: {
          name: 'Gaurav Kumar', // You can replace this with dynamic name if needed
          contact: '+919000090000', // You can replace with dynamic contact if needed
          email: student_email, // Student's email
        },
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: true,
        notes: {
          policy_name: "Jeevan Bima", // Add your custom notes here
        },
        callback_url: 'http://localhost:5000/api/payments/customPackage/webhook', // Callback URL
        callback_method: 'get', // HTTP method for the callback
      },
      {
        auth: {
          username: razorpayInstance.key_id, // Razorpay Key ID
          password: razorpayInstance.key_secret, // Razorpay Key Secret
        },
      }
    );
    const paymentLink = paymentLinkResponse.data.short_url;
    // Respond with success
    res.json({
      success: true,
      message: 'Payment link sent to the student email.',
      paymentLink: paymentLink
    });
  } catch (error) {
    console.error('Error creating Razorpay payment link or sending email:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};