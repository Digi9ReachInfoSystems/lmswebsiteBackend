// src/app.js
const express = require("express");
const cors = require("cors");
const packageRoutes = require("./src/routes/adminPackageRoutes");
const helmet = require("helmet");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");
const classRoutes = require("./src/routes/classRoutes");
const subjectRoutes = require("./src/routes/subjectRoutes");
const bannerRoutes = require("./src/routes/bannerRoute");
const courseRoutes = require("./src/routes/courseRoute");
const customerQueryRoutes = require("./src/routes/customerQueriesRoutes");
const zoomRoutes = require("./src/routes/zoomRoutes");
const timeSlotRoutes = require("./src/routes/timeSlotRoutes");
const quizRoutes = require("./src/routes/quizRoutes");
const responseRoutes = require("./src/routes/responseRoutes");
const createBatchRoutes = require("./src/routes/batchRoutes");
const circularNotificationRoutes = require("./src/routes/circularNotificationRoutes");
const meetingRoutes = require("./src/routes/meetingRoutes");
const payoutRoutes = require("./src/routes/payoutRoutes");
const createCustomPackageRoutes = require("./src/routes/createCustomPackageRoutes");
const teacherRoutes = require("./src/routes/teacherRoutes");


// const paymentRoutes = require("./src/routes/paymentRoutes");
const contentRoutes = require("./src/routes/contentRoutes");
const studentRoutes= require("./src/routes/studentRoutes");
const feedbackRoutes = require("./src/routes/feedbackRoutes");
const statsRoutes = require('./src/routes/statsRoutes');
const benefitsRoutes = require('./src/routes/benefitsRoutes');
const testimonialRoutes = require('./src/routes/testimonialRoutes');
const chooseUsRoutes= require('./src/routes/chooseUsRoutes');
const faqRoutes = require('./src/routes/faqRoutes');
const userRoutes = require('./src/routes/userRoutes');
const boardRoutes = require('./src/routes/boardRoutes');
const paymentRoutes= require('./src/routes/paymentRoutes');
const bodyParser = require('body-parser');
const refreshTokenRoutes = require('./src/routes/refreshTokenRoutes');
const adminDasboardRoutes = require('./src/routes/adminDashboardRoutes');

require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(helmet());

// Routes
app.use("/auth", authRoutes);
const teacherApplicationRoutes = require("./src/routes/teacherApplicationRoutes");

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
app.use("/teacher-application", teacherApplicationRoutes);
app.use("/classes", classRoutes);
app.use("/subjects", subjectRoutes);
app.use("/banners", bannerRoutes);
app.use("/courses", courseRoutes);
app.use("/queries", customerQueryRoutes);

app.use("/timeSlots", timeSlotRoutes);
app.use("/quizzes", quizRoutes);
app.use("/responses", responseRoutes);

app.use("/customPackages", createCustomPackageRoutes);

app.use("/batches", createBatchRoutes);
app.use("/circularNotifications", circularNotificationRoutes);
app.use("/zoom", zoomRoutes);
app.use("/meetings", meetingRoutes);
app.use("/payouts", payoutRoutes);
app.use("/packages", packageRoutes);
app.use("/teachers", teacherRoutes);
app.use("/contents", contentRoutes);
app.use("/students",studentRoutes);
app.use("/feedback", feedbackRoutes);
app.use('/stats', statsRoutes);
app.use('/benefits', benefitsRoutes);
app.use('/testimonials', testimonialRoutes);
app.use('/chooseUs', chooseUsRoutes);
app.use('/faqs', faqRoutes);
app.use('/users', userRoutes);
app.use('/boards', boardRoutes);
// Body parser for webhook to get raw body
app.use('/api/payments/webhook', bodyParser.raw({ type: 'application/json' }));
app.use('/api/payments', paymentRoutes);
app.use("/refreshToken",refreshTokenRoutes);
app.use('/adminDashboard', adminDasboardRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
