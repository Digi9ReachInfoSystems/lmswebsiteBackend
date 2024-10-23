const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Create Feedback
router.post('/createfeedback', feedbackController.createFeedback);

// Get Feedback by ID
router.get('/:id', feedbackController.getFeedbackById);

// Get Feedback by Batch ID
router.get('/batch/:batch_id', feedbackController.getFeedbackByBatchId);

// Get Feedback by Teacher ID
router.get('/teacher/:teacher_id', feedbackController.getFeedbackByTeacherId);

// Get All Feedback
router.get('/', feedbackController.getAllFeedback);

module.exports = router;
