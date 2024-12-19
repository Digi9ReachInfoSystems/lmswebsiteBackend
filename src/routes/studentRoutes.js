const express = require("express");
const router = express.Router();
const {
  createStudent,
  getStudentById,
  getAllStudents,
  updateStudent,
  deleteStudent,
  getStudentSubscriptionStats,
  getPaymentStatusChartData,
  getStudentsBySubjectAndClassId,
  getStudentByAuthId,
  getStudentsByClassId,
  getStudentsforBatchBySubject,
  getStudentSchedule,
  clockIn,
  clockOut,
  getStudentAttendance,
  getStudentsWithAttendance,
  updateModeToPersonal,
  getStudentScheduleNext7Days,
  getEligibleStudents
} = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

// Route to create a new student
router.post("/createStudent", createStudent);

// Route to get a student by ID
router.get("/:id", getStudentById);

// Route to get all students
router.get("/", getAllStudents);

// Route to update a student by ID
// router.put('/:id', updateStudent);

// Route to delete a student by ID
router.delete("/:id", deleteStudent);

// Route to get student subscription statistics
router.get(
  "/subscription/stats",
  authMiddleware,
  authorizeRole("admin"),
  getStudentSubscriptionStats
);
 
router.get("/getstudent/getbyAuthId",getStudentByAuthId);

// Route to get payment status chart data
router.get(
  "/payment/statusChart",
  authMiddleware,
  authorizeRole("admin"),
  getPaymentStatusChartData
);

// Update student by ID
router.put("/update/:studentId", updateStudent);

router.get(
  "/subject/:subject_id/class/:class_id",
  getStudentsBySubjectAndClassId
);

router.get("/class/:class_id",
  getStudentsByClassId);

router.get("/batch/subject/:subjectId", getStudentsforBatchBySubject);


router.get("/student/:id/schedule", getStudentSchedule);

router.post("/clock-in",clockIn);

router.post("/clock-out",clockOut);

router.get("/student/attendance", getStudentAttendance );

router.get("/student/forattendance",getStudentsWithAttendance)
router.put("/student/mode",updateModeToPersonal)

router.get("/student/:id/scheduleSevenDays", getStudentScheduleNext7Days);

router.post("/student/eligible-student",getEligibleStudents)

module.exports = router;
