const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

// Import the controller functions (Ensure this matches your exports)
const teacherApplicationController = require("../controllers/teacherApplicationController");

// Routes
router.post(
  "/apply",
  authMiddleware,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  [
    body("state").notEmpty().withMessage("State is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("pincode").isNumeric().withMessage("Pincode must be a number"),
    body("language").notEmpty().withMessage("Language is required"),
    body("current_position").notEmpty().withMessage("Current position is required"),
  ],
  teacherApplicationController.createTeacherApplication // Correct reference
);

router.get(
  "/",
  authMiddleware,
  authorizeRole("admin"),
  teacherApplicationController.getTeacherApplications // Correct reference
);

router.put(
  "/approve/:applicationId",
  authMiddleware,
  authorizeRole("admin"),
  teacherApplicationController.approveTeacherApplication // Correct reference
);

// Route to get a single teacher application by ID
router.get("/application/single/:id", authMiddleware,
  authorizeRole("admin"),
  teacherApplicationController.getTeacherApplicationById);

module.exports = router;
