// src/routes/teacherRoutes.js

const express = require("express");
const router = express.Router();

// Import controller functions
const {
  getTeacherById,
  getAllTeachers,
  updateTeacherDetails,
  getExperiencedTeachers,
  getTeachersBySubjectId,
  getTeacherByAuthId,
  getTeacherSchedule,
  clockIn,
  clockOut,
} = require("../controllers/teacherController");

// Import authentication middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Apply authentication middleware to all routes in this router
// router.use(authMiddleware);

/**
 * @route   GET /teachers/:id
 * @desc    Get a teacher by ID (accessible only by the teacher themselves)
 * @access  Private (Teacher only)
 */
router.get("/:id", authMiddleware, getTeacherById);

/**
 * @route   GET /teachers
 * @desc    Get all teachers (accessible only by admin users)
 * @access  Private (Admin only)
 */
router.get("/", authMiddleware, getAllTeachers);
router.get("/subject/:subject", getTeachersBySubjectId);

router.put("/update/:id", authMiddleware, updateTeacherDetails);

// Route to get teachers with more than 3 years of experience
router.get("/experience/greater", getExperiencedTeachers);

router.get("/teacher/AuthId", getTeacherByAuthId);

router.get("/teacher/:id/schedule", getTeacherSchedule);

router.post("/clock-in", clockIn);

// Route for clocking out
router.post("/clock-out", clockOut);

module.exports = router;
