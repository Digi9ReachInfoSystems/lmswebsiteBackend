// controllers/assignmentController.js

const Assignment = require('../models/assignmentModel');
const Batch = require('../models/batchModel');
const Teacher = require('../models/teacherModel');
const Student = require('../models/studentModel');
const mongoose = require('mongoose');

/**
 * Create a new Assignment
 */
const createAssignment = async (req, res) => {
    try {
        const { batch_id, teacher_id, content_url, expiry_date } = req.body;

        if (!batch_id || !teacher_id || !content_url || !expiry_date) {
            return res.status(400).json({ error: 'batch_id, teacher_id, content_url, and expiry_date are required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(batch_id)) {
            return res.status(400).json({ error: 'Invalid batch_id.' });
        }
        if (!mongoose.Types.ObjectId.isValid(teacher_id)) {
            return res.status(400).json({ error: 'Invalid teacher_id.' });
        }

        const batch = await Batch.findById(batch_id);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found.' });
        }

        const teacher = await Teacher.findById(teacher_id);
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found.' });
        }

        const newAssignment = new Assignment({
            batch_id,
            teacher_id,
            content_url,
            expiry_date,
            responses: [],
        });

        const savedAssignment = await newAssignment.save();

        res.status(201).json({
            message: 'Assignment created successfully.',
            assignment: savedAssignment,
        });
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * Add a student response to an Assignment
 */
const addStudentResponse = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { student_id, response_url, submission_date } = req.body;

        if (!student_id || !response_url) {
            return res.status(400).json({ error: 'student_id and response_url are required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ error: 'Invalid assignmentId.' });
        }
        if (!mongoose.Types.ObjectId.isValid(student_id)) {
            return res.status(400).json({ error: 'Invalid student_id.' });
        }

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found.' });
        }

        const student = await Student.findById(student_id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        const existingResponse = assignment.responses.find(
            (response) => response.student_id.toString() === student_id
        );

        if (existingResponse) {
            return res.status(400).json({ error: 'Student has already submitted a response.' });
        }

        const newResponse = {
            student_id,
            response_url,
            submission_date: submission_date ? new Date(submission_date) : new Date(),
        };

        assignment.responses.push(newResponse);

        const updatedAssignment = await assignment.save();

        res.status(200).json({
            message: 'Response added successfully.',
            assignment: updatedAssignment,
        });
    } catch (error) {
        console.error('Error adding student response:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * Delete a student response from an Assignment
 */
const deleteStudentResponse = async (req, res) => {
    try {
        const { assignmentId, studentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ error: 'Invalid assignmentId.' });
        }
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Invalid studentId.' });
        }

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found.' });
        }

        const responseIndex = assignment.responses.findIndex(
            (response) => response.student_id.toString() === studentId
        );

        if (responseIndex === -1) {
            return res.status(404).json({ error: 'Response from the specified student not found.' });
        }

        assignment.responses.splice(responseIndex, 1);

        const updatedAssignment = await assignment.save();

        res.status(200).json({
            message: 'Student response deleted successfully.',
            assignment: updatedAssignment,
        });
    } catch (error) {
        console.error('Error deleting student response:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * Update a student response in an Assignment
 */
const updateStudentResponse = async (req, res) => {
    try {
        const { assignmentId, studentId } = req.params;
        const { response_url, submission_date } = req.body;

        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ error: 'Invalid assignmentId.' });
        }
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Invalid studentId.' });
        }

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found.' });
        }

        const response = assignment.responses.find(
            (resp) => resp.student_id.toString() === studentId
        );

        if (!response) {
            return res.status(404).json({ error: 'Response from the specified student not found.' });
        }

        if (response_url) {
            response.response_url = response_url;
        }
        if (submission_date) {
            response.submission_date = new Date(submission_date);
        }

        const updatedAssignment = await assignment.save();

        res.status(200).json({
            message: 'Student response updated successfully.',
            assignment: updatedAssignment,
        });
    } catch (error) {
        console.error('Error updating student response:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * Edit an existing Assignment
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const editAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { batch_id, teacher_id, content_url, expiry_date } = req.body;

        // Validate assignmentId
        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ error: 'Invalid assignmentId.' });
        }

        // Find the Assignment
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found.' });
        }

        // If batch_id is being updated, validate it
        if (batch_id) {
            if (!mongoose.Types.ObjectId.isValid(batch_id)) {
                return res.status(400).json({ error: 'Invalid batch_id.' });
            }
            const batch = await Batch.findById(batch_id);
            if (!batch) {
                return res.status(404).json({ error: 'Batch not found.' });
            }
            assignment.batch_id = batch_id;
        }

        // If teacher_id is being updated, validate it
        if (teacher_id) {
            if (!mongoose.Types.ObjectId.isValid(teacher_id)) {
                return res.status(400).json({ error: 'Invalid teacher_id.' });
            }
            const teacher = await Teacher.findById(teacher_id);
            if (!teacher) {
                return res.status(404).json({ error: 'Teacher not found.' });
            }
            assignment.teacher_id = teacher_id;
        }

        // Update other fields if provided
        if (content_url) {
            assignment.content_url = content_url;
        }
        if (expiry_date) {
            const newExpiryDate = new Date(expiry_date);
            if (isNaN(newExpiryDate)) {
                return res.status(400).json({ error: 'Invalid expiry_date format.' });
            }
            assignment.expiry_date = newExpiryDate;
        }

        // Save the updated Assignment
        const updatedAssignment = await assignment.save();

        res.status(200).json({
            message: 'Assignment updated successfully.',
            assignment: updatedAssignment,
        });
    } catch (error) {
        console.error('Error editing assignment:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
/**
* Delete an existing Assignment
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*/
const deleteAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        // Validate assignmentId
        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ error: 'Invalid assignmentId.' });
        }

        // Find and delete the Assignment
        const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);

        if (!deletedAssignment) {
            return res.status(404).json({ error: 'Assignment not found.' });
        }

        res.status(200).json({
            message: 'Assignment deleted successfully.',
            assignment: deletedAssignment,
        });
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
/**
 * Get Assignment by ID
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const getAssignmentById = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        // Validate assignmentId
        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ error: 'Invalid assignmentId.' });
        }

        // Find the Assignment and populate references
        const assignment = await Assignment.findById(assignmentId)
            .populate('batch_id', )
            .populate({
                path: "teacher_id",
                populate: { path: "user_id", select: "name email" },
              })
            .populate({
                path: "responses.student_id",
                populate: { path: "user_id", select: "name email" },
              });

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found.' });
        }

        res.status(200).json({
            message: 'Assignment retrieved successfully.',
            assignment,
        });
    } catch (error) {
        console.error('Error retrieving assignment by ID:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
* Get All Assignments
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*/
const getAllAssignments = async (req, res) => {
    try {
      const assignments = await Assignment.find()
        .populate('batch_id', 'batch_name')
        .populate({
            path: "teacher_id",
            populate: { path: "user_id", select: "name email" },
          })
        .populate({
            path: "responses.student_id",
            populate: { path: "user_id", select: "name email" },
          })
        .sort({ createdAt: -1 }); // Sort by newest first
  
      res.status(200).json({
        message: 'Assignments retrieved successfully.',
        assignments,
      });
    } catch (error) {
      console.error('Error retrieving all assignments:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };


const getAssignmentsByTeacherId = async (req, res) => {
    try {
      const { teacherId } = req.params;
  
      // Validate teacherId
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).json({ error: 'Invalid teacherId.' });
      }
  
      // Check if Teacher exists
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found.' });
      }
  
      // Find Assignments associated with the teacher
      const assignments = await Assignment.find({ teacher_id: teacherId })
        .populate('batch_id', 'batch_name')
        .populate({
            path: "teacher_id",
            populate: { path: "user_id", select: "name email" },
          })
        .populate({
            path: "responses.student_id",
            populate: { path: "user_id", select: "name email" },
          })
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        message: 'Assignments retrieved successfully.',
        assignments,
      });
    } catch (error) {
      console.error('Error retrieving assignments by teacher ID:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

const getAssignmentsByBatchId = async (req, res) => {
    try {
      const { batchId } = req.params;
  
      // Validate batchId
      if (!mongoose.Types.ObjectId.isValid(batchId)) {
        return res.status(400).json({ error: 'Invalid batchId.' });
      }
  
      // Check if Batch exists
      const batch = await Batch.findById(batchId);
      if (!batch) {
        return res.status(404).json({ error: 'Batch not found.' });
      }
  
      // Find Assignments associated with the batch
      const assignments = await Assignment.find({ batch_id: batchId })
        .populate('batch_id', 'batch_name')
        .populate({
            path: "teacher_id",
            populate: { path: "user_id", select: "name email" },
          })
        .populate({
            path: "responses.student_id",
            populate: { path: "user_id", select: "name email" },
          })
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        message: 'Assignments retrieved successfully.',
        assignments,
      });
    } catch (error) {
      console.error('Error retrieving assignments by batch ID:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };


module.exports = {
    createAssignment,
    addStudentResponse,
    deleteStudentResponse,
    updateStudentResponse,
    editAssignment,
    deleteAssignment,
    getAssignmentById,
    getAllAssignments,
    getAssignmentsByTeacherId,
    getAssignmentsByBatchId
};
