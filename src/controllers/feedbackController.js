const Feedback = require('../models/feedbackModel');

// Create Feedback
exports.createFeedback = async (req, res) => {
  try {
    const { teacher_id, student_id, batch_id, feedback_text } = req.body;

    // Validate required fields
    if (!teacher_id || !student_id || !batch_id || !feedback_text) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const feedback = new Feedback({
      teacher_id,
      student_id,
      batch_id,
      feedback_text,
    });

    const savedFeedback = await feedback.save();
    res.status(201).json({
      message: 'Feedback created successfully',
      feedback: savedFeedback,
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id)
      .populate('batch_id', 'batch_name'); // Populate batch details

    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });

    res.status(200).json({ feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Feedback by Batch ID
exports.getFeedbackByBatchId = async (req, res) => {
  try {
    const { batch_id } = req.params;
    const feedbacks = await Feedback.find({ batch_id });

    if (!feedbacks.length) return res.status(404).json({ error: 'No feedback found for this batch' });

    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Feedback by Teacher ID
exports.getFeedbackByTeacherId = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const feedbacks = await Feedback.find({ teacher_id })
      .populate('batch_id', 'batch_name');

    if (!feedbacks.length) return res.status(404).json({ error: 'No feedback found for this teacher' });

    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All Feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
    .populate('batch_id', 'batch_name'); // Populate batch_id with batch_name
   
    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
