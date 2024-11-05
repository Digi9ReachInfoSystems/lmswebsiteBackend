// src/controllers/quizController.js

const Quiz = require('../models/quizModel');
// Create a new quiz (Accessible to any authenticated user)
exports.createQuiz = async (req, res) => {
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
