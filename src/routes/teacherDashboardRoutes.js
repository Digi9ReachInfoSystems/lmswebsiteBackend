const express = require("express");
const router = express.Router();
const teacherDashboardController = require("../controllers/teacherDashboardController");

// router.get("/count/:teacherId", teacherDashboardController.getBatchCount);

router.get("/count/:teacherId",teacherDashboardController.getBatchesCount);

router.get("/countstudents/:teacherId",teacherDashboardController.getStudentsCount);
router.get("/recent/:teacherId", teacherDashboardController.getRecentQuizForTeacher);
router.get("/workingHours/:teacherId", teacherDashboardController.getTotalWorkingHours);
module.exports = router;