
// controllers/batchController.js
const Batch = require('../models/batchModel');
const Quiz = require('../models/quizModel');
const Teacher = require('../models/teacherModel');
const mongoose = require('mongoose');


exports.getBatchesCount = async (req, res) => {
  try {
    // Extract and clean the teacherId from request params
    let { teacherId } = req.params;
    teacherId = teacherId.trim(); // Remove any extra spaces or newline characters

    // Check if the teacherId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID',
      });
    }

    // Find the batches where the teacher_id array contains the teacherId
    const batchCount = await Batch.countDocuments({
      teacher_id: teacherId,
    });

    // Return the count of batches
    return res.status(200).json({
      success: true,
      count: batchCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};



// Controller function to get total students for a given teacher
exports.getStudentsCount = async (req, res) => {
  console.log('Teacher ID:', req.params.teacherId);  // Log the teacherId to ensure it's being received correctly
  try {
    let teacherId = req.params.teacherId.trim();  // Trim any unwanted characters

    const batches = await Batch.find({ teacher_id: teacherId });

    let totalStudents = 0;
    batches.forEach(batch => {
      totalStudents += batch.students.length;
    });

    return res.status(200).json({
      success: true,
      totalStudents,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the total students.',
      error: error.message,
    });
  }
};



// Controller to get the most recent quiz for a specific teacher
exports.getRecentQuizForTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId; // Assuming teacherId is passed as a route parameter

    // Validate if teacherId is provided
    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required' });
    }

    // Find the most recent quiz for the given teacherId
    const recentQuiz = await Quiz.findOne({ teacher_id: teacherId })
      .sort({ created_at: -1 }) // Sort by created_at descending to get the most recent quiz
      .populate('teacher_id') // Optional: Populate teacher details if needed
      .populate('batch_index') // Optional: Populate batch details if needed
      .populate('class_level') // Optional: Populate class details if needed
      .populate('subject'); // Optional: Populate subject details if needed

    if (!recentQuiz) {
      return res.status(404).json({ message: 'No quiz found for this teacher' });
    }

    // Return the recent quiz data
    return res.status(200).json(recentQuiz);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTotalWorkingHours = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    // Validate if teacherId is provided
    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required' });
    }
     const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

   

    return res.status(200).json({message:"Total working hours fetched successfully",totalWorkingHours:teacher.worked_hours});

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the total working hours.',
      error: error.message,
    });
  }
};
