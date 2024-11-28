// src/controllers/quizController.js
const mongoose = require('mongoose');
const Quiz = require('../models/quizModel');
// Create a new quiz (Accessible to any authenticated user)
exports.createQuiz = async (req, res) => {
  console.log(req.body);
  try {
    const {
      quiz_title,
      teacher_id,
      batch_index,
      class_level,
      subject,
      description,
      dueDate,
      questions,
    } = req.body;

    // Validate required fields
    if (
      !quiz_title ||
      !teacher_id ||
      !batch_index ||
      !class_level ||
      !subject ||
      !questions ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new quiz
    const newQuiz = new Quiz({
      quiz_title,
      teacher_id,
      batch_index,
      class_level,
      subject,
      description, // Include the description
      dueDate, // Include the due date
      questions,
      created_date: Date.now(), // Automatically set the current date/time
    });

    const savedQuiz = await newQuiz.save();

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz: savedQuiz,
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get quizzes for a specific batch and class
exports.getQuizzes = async (req, res) => {
  try {
    const { batch_index, class_level } = req.params;

    const quizzes = await Quiz.find({
      batch_index: batch_index,
      class_level: class_level,
    })
      .populate('teacher_id', 'name email')
      .populate('subject', 'subject_name')
      .exec();

    res.status(200).json({
      message: 'Quizzes fetched successfully',
      quizzes,
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const { quiz_id } = req.params;

    const quiz = await Quiz.findById(quiz_id)
      .populate('teacher_id', 'name email')
      .populate('subject', 'subject_name')
      .exec();

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.status(200).json({
      message: 'Quiz fetched successfully',
      quiz,
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


/**
 * Controller to get quizzes based on optional filters:
 * - teacher_id
 * - batch_id
 * - class_id
 * - subject_id
 * 
 * These filters are expected to be passed as query parameters.
 * None of them are mandatory.
 */
exports.getQuizzesByTeacher = async (req, res) => {
  try {
    const { teacher_id, batch_id, class_id, subject_id } = req.query;

    // Initialize an empty query object
    let query = {};

    // Validate and add teacher_id to query if provided
    if (teacher_id) {
      if (!mongoose.Types.ObjectId.isValid(teacher_id)) {
        return res.status(400).json({ error: "Invalid teacher_id" });
      }
      query.teacher_id = teacher_id;
    }

    // Validate and add batch_id to query if provided
    if (batch_id) {
      if (!mongoose.Types.ObjectId.isValid(batch_id)) {
        return res.status(400).json({ error: "Invalid batch_id" });
      }
      query.batch_index = batch_id;
    }

    // Validate and add class_id to query if provided
    if (class_id) {
      if (!mongoose.Types.ObjectId.isValid(class_id)) {
        return res.status(400).json({ error: "Invalid class_id" });
      }
      query.class_level = class_id;
    }

    // Validate and add subject_id to query if provided
    if (subject_id) {
      if (!mongoose.Types.ObjectId.isValid(subject_id)) {
        return res.status(400).json({ error: "Invalid subject_id" });
      }
      query.subject = subject_id;
    }

    // Execute the query without pagination
    const quizzes = await Quiz.find(query)
      .populate("teacher_id", "name email") // Populate teacher's name and email
      .populate("batch_index", "batch_name") // Populate batch name
      .populate("class_level", "className classLevel") // Populate class details
      .populate({ path: "subject", select: "subject_name" }) // Populate subject name
      .populate({
        path: 'answered_by.student_id',
        populate: { path: 'user_id', select: 'name email' },
      })
      .exec();

    // Check if any quizzes are found
    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found matching the criteria" });
    }

    // Return the quizzes
    res.status(200).json({
      message: "Quizzes fetched successfully",
      quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getQuizBySubjectId = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const quizzes = await Quiz.find({ subject: subject_id })
      .populate('teacher_id', 'name email')
      .populate('subject', 'subject_name')
      .exec();
    res.status(200).json({
      message: 'Quizzes fetched successfully',
      quizzes,
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Server error' });
  }
};