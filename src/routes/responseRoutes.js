// src/routes/responseRoutes.js

const express = require('express');
const router = express.Router();
const responseController = require('../controllers/responseController');
const authMiddleware = require('../middlewares/authMiddleware');

// Submit a quiz response (Accessible to any authenticated user)
router.post('/response',responseController.submitResponse);

// Get all responses for a quiz
router.get('/quiz/:quiz_id', authMiddleware, responseController.getResponsesByQuiz);

// Get monthly report for a student
router.get('/:studentId/report/:month/:year', responseController.getMonthlyReport);

module.exports = router;
