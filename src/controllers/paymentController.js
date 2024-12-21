

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
  const { studentId, amount, description } = req.body;

  // Validate input
  if (!studentId || !amount) {
    return res.status(400).json({ error: 'Missing required fields: studentId, amount' });
  }

  try {
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if package exists
    // const package = await Package.findById(packageId);
    // if (!package) {
    //   return res.status(404).json({ error: 'Package not found' });
    // }

    // Create Razorpay order
    const orderOptions = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture
      notes: {
        student_id: studentId,
        // package_id: packageId,
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
      // package_id: packageId,
       description: description || 'Payment for course package',
      receipt: order.receipt,
      razorpay_signature: order.razorpay_signature
    });

    await payment.save();

    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Unable to create order' });
  }
};

// exports.verifyPayment = async (req, res) => {
//   const signature = req.headers['x-razorpay-signature']; // Signature sent by Razorpay
//   const secrete = 'FPs-kRnkuFXq8tG-course-Payment'
//   const generated_signature = crypto.createHmac('sha256', secrete);
//   generated_signature.update(JSON.stringify(req.body));
//   const digested_signature = generated_signature.digest('hex');

//   if (digested_signature === signature) {
//     if (req.body.event == "payment.captured") {
//       console.log("Valid signature inside payment.captured", req.body);
//       // Payment is valid
//       const payment = await Payment.findOne({ order_id: req.body.payload.payment.entity.order_id });
//       if (!payment) {
//         return res.status(400).json({ error: 'Payment not found' });
//       }
//       // Update payment details
//       payment.payment_id = req.body.payload.payment.entity.id;
//       payment.status = 'paid';
//       await payment.save();
//       // Update student details
//       await Student.findByIdAndUpdate(payment.student_id, {
//         $push: {
//           // subscribed_Package: { _id: payment.package_id, is_active: true },
//           payment_id: payment._id
//         },
//         is_paid: true,
//       });

//       // Fetch the package to get duration
//       // const pkg = await Package.findById(payment.package_id);

//       // if (!pkg) {
//       //   return res.status(400).json({ error: "Associated package not found" });
//       // }

//       // Calculate package_expiry: payment date + duration months
//       // const paymentDate = new Date(); // Assuming payment is processed now
//       // const packageExpiryDate = new Date(
//       //   paymentDate.setMonth(paymentDate.getMonth() + pkg.duration)
//       // );

//       // Update student details
//       // await Student.findByIdAndUpdate(payment.student_id, {
//       //   package_expiry: packageExpiryDate,
//       // });

//     } else if (req.body.event == "payment_link.paid") {
//       console.log("Valid signature inside payment.link.paid", req.body);
//       console.log("request", req.body.payload.order.entity);
//       // Payment is valid
//       const payment = await Payment.findOne({ receipt: req.body.payload.order.entity.receipt });
//       console.log("payment", payment);
//       if (!payment) {
//         return res.status(400).json({ error: 'Payment not found' });
//       }
//       // Update payment details
//       payment.payment_id = req.body.payload.payment.entity.id;
//       payment.status = 'paid';
//       await payment.save();
//       // Update student details
//       await Student.findByIdAndUpdate(payment.student_id, {
//         $push: {
//           custom_package_id: { _id: payment.custom_package_id, is_active: true },
//           payment_id: payment._id
//         },
//         custom_package_status: "approved",
//       });
//       // Fetch the package to get duration
//       const pkg = await CustomPackage.findById(payment.custom_package_id);

//       if (!pkg) {
//         return res.status(400).json({ error: "Associated custom package not found" });
//       }

//       // Calculate package_expiry: payment date + duration months
//       const paymentDate = new Date(); // Assuming payment is processed now
//       const packageExpiryDate = new Date(
//         paymentDate.setMonth(paymentDate.getMonth() + pkg.duration)
//       );

//       // Update student details
//       await Student.findByIdAndUpdate(payment.student_id, {
//         custom_package_expiry: packageExpiryDate,
//       });
//       // update custom package details
//       await CustomPackage.findByIdAndUpdate(payment.custom_package_id, {
//         is_active: true, is_approved: true, is_price_finalized: true, admin_contacted: true, package_price: payment.amount,
//       });
//     }

//   } else {
//     console.log("Invalid signature");
//   }

//   res.json({ status: "ok" });
// }


exports.verifyPayment = async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const secrete = "FPs-kRnkuFXq8tG-course-Payment";
  const generated_signature = crypto.createHmac("sha256", secrete);
  generated_signature.update(JSON.stringify(req.body));
  const digested_signature = generated_signature.digest("hex");

  if (digested_signature === signature) {
    if (req.body.event == "payment.captured") {
      console.log("Valid signature inside payment.captured", req.body);

      // Payment is valid
      const payment = await Payment.findOne({
        order_id: req.body.payload.payment.entity.order_id,
      });
      if (!payment) {
        return res.status(400).json({ error: "Payment not found" });
      }

      // Update payment details
      payment.payment_id = req.body.payload.payment.entity.id;
      payment.status = "paid";
      await payment.save();

      // Update student: set is_paid, push payment_id, etc.
      await Student.findByIdAndUpdate(payment.student_id, {
        $push: { payment_id: payment._id },
        is_paid: true,
      });
    } else if (req.body.event == "payment_link.paid") {
      console.log("Valid signature inside payment.link.paid", req.body);
      console.log("request", req.body.payload.order.entity);

      // Payment is valid
      const payment = await Payment.findOne({
        receipt: req.body.payload.order.entity.receipt,
      });
      console.log("payment", payment);

      if (!payment) {
        return res.status(400).json({ error: "Payment not found" });
      }

      // Update payment details
      payment.payment_id = req.body.payload.payment.entity.id;
      payment.status = "paid";
      await payment.save();

      // Update student details
      await Student.findByIdAndUpdate(payment.student_id, {
        $push: {
          custom_package_id: {
            _id: payment.custom_package_id,
            is_active: true,
          },
          payment_id: payment._id,
        },
        custom_package_status: "approved",
      });

      // Fetch the custom package to get duration and subject_id
      const pkg = await CustomPackage.findById(payment.custom_package_id);
      if (!pkg) {
        return res
          .status(400)
          .json({ error: "Associated custom package not found" });
      }

      // Calculate package_expiry: payment date + duration months
      const paymentDate = new Date(); // Payment is processed now
      const packageExpiryDate = new Date(
        paymentDate.setMonth(paymentDate.getMonth() + (pkg.duration || 0))
      );

      // Update student with custom_package_expiry
      await Student.findByIdAndUpdate(payment.student_id, {
        custom_package_expiry: packageExpiryDate,
      });

      // update custom package details
      await CustomPackage.findByIdAndUpdate(payment.custom_package_id, {
        is_active: true,
        is_approved: true,
        is_price_finalized: true,
        admin_contacted: true,
        package_price: payment.amount,
      });

      // -------------- NEW CODE: ADD CUSTOM PACKAGE SUBJECTS TO STUDENT --------------
      // Retrieve the student's document so we can insert subject subdocs
      const studentDoc = await Student.findById(payment.student_id);
      if (!studentDoc) {
        return res.status(404).json({ error: "Student not found" });
      }

      // pkg.subject_id is assumed to be an array of Subject _ids (from your customPackage model)
      // We'll push them into studentDoc.subject_id if they don't already exist
      pkg.subject_id.forEach((subjectId) => {
        const alreadyExists = studentDoc.subject_id.some(
          (sub) => sub._id.toString() === subjectId.toString()
        );
        if (!alreadyExists) {
          // Add a new subdocument with default fields
          studentDoc.subject_id.push({
            _id: subjectId,
            batch_assigned: false,
            batch_expiry_date: null,
            batch_status: "new",
            duration: pkg.duration || 0, // store same duration as custom package if desired
          });
        }
      });

      // Save the updated student
      await studentDoc.save();

      console.log(
        `Added subjects from custom package ${pkg._id} to student ${studentDoc._id}`
      );
      // -------------- END OF NEW CODE -----------------------------------------------

      console.log("Payment link paid, custom package updated successfully");
    }
  } else {
    console.log("Invalid signature");
  }

  res.json({ status: "ok" });
};


exports.createCustomPackageOrder = async (req, res) => {
  const { amount, package_id, student_id, duration } = req.body;
  try {
    // Create Razorpay order
    // Validate input
    if (!student_id || !package_id || !amount) {
      return res.status(400).json({ error: 'Missing required fields: studentId, packageId, amount' });
    }
    // Check if student exists
    const student = await Student.findById(student_id).populate("user_id");
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    // Check if package exists
    const package = await CustomPackage.findById(package_id);
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
      // Create Razorpay order

    }
    package.duration = duration;
    await package.save();
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
        reference_id: order.receipt, // Reference ID for tracking
        description: `Payment for Custom Package - Package ID: ${package_id}`,
        customer: {
          name: student.user_id.name, // You can replace this with dynamic name if needed
          contact: student.phone_number, // You can replace with dynamic contact if needed
          email: student.user_id.email, // Student's email
        },
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: true,
        notes: {
          policy_name: "Topper Academy Payament", // Add your custom notes here
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

