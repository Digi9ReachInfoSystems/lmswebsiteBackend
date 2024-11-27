// src/routes/quizRoutes.js

const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

// Create a quiz (Accessible to any authenticated user)
router.post('/create', authMiddleware,authorizeRole("teacher"), quizController.createQuiz);

// Get quizzes for a specific batch and class
router.get(
  '/batch/:batch_index/class/:class_level',
  authMiddleware,
  quizController.getQuizzes
);

// Get a specific quiz by ID
router.get('/:quiz_id', authMiddleware, quizController.getQuizById);
/**
 * @route   GET /api/quizzes
 * @desc    Get quizzes based on optional filters: teacher_id, batch_id, class_id, subject_id
 * @access  Public (Adjust access control as needed)
 */
router.get("/Teacher/quizzes", quizController.getQuizzesByTeacher);

router.get("/subject/:subject_id", quizController.getQuizBySubjectId);

module.exports = router;
