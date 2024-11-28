const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const { getNumberOfStudents, getNumberOfTeachers, getToatalPayment, getPaidAndUnpaidAmount, getNumberOfBatches, getApplicationsForLast7Days, getDailyRevenueForMonth } = require("../controllers/adminDashboardController");



router.get("/dashboard/numberOfStudents", getNumberOfStudents);

router.get("/dashboard/numberOfTeachers", getNumberOfTeachers);

router.get("/dashboard/totalrevenue",getToatalPayment);

router.get("/dashboard/amountPaidUnpaid",getPaidAndUnpaidAmount);

router.get("/dashboard/totalBatches",getNumberOfBatches);

router.get("/dashboard/weeklyTeacherApplication",getApplicationsForLast7Days);

router.get("/dashboard/dailyRevenueForMonth",getDailyRevenueForMonth);

module.exports = router;