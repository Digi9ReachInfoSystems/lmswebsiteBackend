// routes/assignmentRoutes.js

const express = require('express');
const router = express.Router();
const {
  createAssignment,
  addStudentResponse,
  deleteStudentResponse,
  updateStudentResponse,
  editAssignment,
  deleteAssignment,
  getAssignmentById,
  getAllAssignments,
  getAssignmentsByTeacherId,
  getAssignmentsByBatchId,
} = require('../controllers/assignmentController');


// Route: POST /api/assignments
// Description: Create a new assignment
router.post(
  '/',
  // authenticate, // Uncomment if authentication is required
  // authorize(['admin', 'teacher']), // Adjust roles as necessary
  createAssignment
);

// Route: POST /api/assignments/:assignmentId/responses
// Description: Add a student response to an assignment
router.post(
  '/:assignmentId/responses',
  addStudentResponse
);

// Route: DELETE /api/assignments/:assignmentId/responses/:studentId
// Description: Delete a student response from an assignment
router.delete(
  '/:assignmentId/responses/:studentId',
  deleteStudentResponse
);

// Route: PUT /api/assignments/:assignmentId/responses/:studentId
// Description: Update a student response in an assignment
router.put(
  '/:assignmentId/responses/:studentId',
  updateStudentResponse
);
// Route: PUT /api/assignments/:assignmentId
// Description: Edit an existing assignment
router.put(
    '/:assignmentId',
    editAssignment
  );
  
  // Route: DELETE /api/assignments/:assignmentId
  // Description: Delete an existing assignment
  router.delete(
    '/:assignmentId',
    deleteAssignment
  );
  router.get(
    '/:assignmentId',
    getAssignmentById
  );
  
  /**
   * @route   GET /api/assignments
   * @desc    Get all assignments
   * @access  Protected (admin, teacher, student)
   */
  router.get(
    '/',
    getAllAssignments
  );
  
  /**
   * @route   GET /api/assignments/teacher/:teacherId
   * @desc    Get assignments by Teacher ID
   * @access  Protected (admin, teacher)
   */
  router.get(
    '/teacher/:teacherId',
    getAssignmentsByTeacherId
  );
  
  /**
   * @route   GET /api/assignments/batch/:batchId
   * @desc    Get assignments by Batch ID
   * @access  Protected (admin, teacher)
   */
  router.get(
    '/batch/:batchId',
    getAssignmentsByBatchId
  );

module.exports = router;
