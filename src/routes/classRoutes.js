// src/routes/classRoutes.js

const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const authMiddleware = require("../middlewares/authMiddleware"); // Assuming you have this for protected routes
const authorizeRole = require("../middlewares/authorizeRole");

// Create a new class (POST)
router.post(
  "/",
  authMiddleware,
  authorizeRole("admin"),
  classController.createClass
);

// Get all classes (GET)
router.get("/", classController.getAllClasses);
// getclass by board id
router.get("/board/:boardId", classController.getAllClassesBoard);

// Update a class (PUT)
router.put(
  "/:classId",
  authMiddleware,
  authorizeRole("admin"),
  classController.updateClass
);

// Delete a class (DELETE)
router.delete(
  "/:classId",
  authMiddleware,
  authorizeRole("admin"),
  classController.deleteClass
);

// Get a class by ID (GET)
router.get("/:classId", classController.getClassById);

module.exports = router;
