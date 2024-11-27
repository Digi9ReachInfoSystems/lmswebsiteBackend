const Response = require('../models/responseModel');
const Quiz = require('../models/quizModel');
const Student = require('../models/studentModel');
const mongoose = require('mongoose');

// Submit a quiz response
exports.submitResponse = async (req, res) => {
  try {
    const { student_id, quiz_id, responses } = req.body;

    if (!student_id || !quiz_id || !responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ error: 'All fields are required' });
    }


  // Check if a response already exists
  const existingResponse = await Response.findOne({ student_id, quiz_id });
  if (existingResponse) {
    return res.status(400).json({ error: 'Response already submitted for this quiz.' });
  }
  

    const quiz = await Quiz.findById(quiz_id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    const student = await Student.findById(student_id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    let score = 0;
    const evaluatedResponses = responses.map((response) => {
      const question = quiz.questions.find(q => q.question_number === response.question_number);
      const isCorrect = response.selected_option_id === question.correct_option_id;
      if (isCorrect) score++;

      return { ...response, is_correct: isCorrect };
    });

    const newResponse = new Response({ student_id, quiz_id, responses: evaluatedResponses, score });
    const savedResponse = await newResponse.save();

    res.status(201).json({ message: 'Response submitted successfully', response: savedResponse });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all responses by quiz
exports.getResponsesByQuiz = async (req, res) => {
  try {
    const { quiz_id } = req.params;
    const quiz = await Quiz.findById(quiz_id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const responses = await Response.find({ quiz_id }).populate('student_id', 'auth_id role');
    res.status(200).json({ message: 'Responses fetched successfully', responses });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get monthly report for a student
exports.getMonthlyReport = async (req, res) => {
  try {
    const { studentId, month, year } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const responses = await Response.find({
      student_id: studentId,
      submitted_at: { $gte: startDate, $lt: endDate },
    }).populate('quiz_id', 'quiz_title');

    if (!responses.length) return res.status(404).json({ message: 'No quizzes found for this month' });

    const totalScore = responses.reduce((acc, res) => acc + res.score, 0);
    const averageScore = totalScore / responses.length;

    const quizDetails = responses.map(res => ({
      quiz_title: res.quiz_id.quiz_title,
      score: res.score,
      submitted_at: res.submitted_at,
    }));

    res.status(200).json({
      message: 'Monthly report fetched successfully',
      report: { studentId, month, year, averageScore, quizDetails },
    });
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
