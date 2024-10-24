const Testimonial = require('../models/testimonialModel');

// Create a testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { student_id, rating, review } = req.body;

    if (!student_id || !rating || !review) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newTestimonial = new Testimonial({ student_id, rating, review });
    await newTestimonial.save();

    res.status(201).json({
      message: 'Testimonial created successfully',
      testimonial: newTestimonial,
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate('student_id', 'name email') // Populate the student_id field with name and email
      .exec();

    res.status(200).json({
      message: 'Testimonials fetched successfully',
      testimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single testimonial by ID
exports.getSingleTestimonial = async (req, res) => {
  try {
    const { testimonialId } = req.params;
    const testimonial = await Testimonial.findById(testimonialId)
      .populate('student_id', 'name email') // Populate the student_id field with name and email
      .exec();

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.status(200).json({
      message: 'Testimonial fetched successfully',
      testimonial,
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a testimonial by ID
exports.deleteTestimonial = async (req, res) => {
  try {
    const { testimonialId } = req.params;
    const deletedTestimonial = await Testimonial.findByIdAndDelete(testimonialId);

    if (!deletedTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.status(200).json({
      message: 'Testimonial deleted successfully',
      testimonial: deletedTestimonial,
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get highest rating testimonial
exports.getHighestRating = async (req, res) => {
    try {
      const highestRating = await Testimonial.find()
        .sort({ rating: -1 }) // Sort by rating descending
        .limit(1)
        .populate('student_id', 'name email') // Populate student_id
        .exec();
  
      if (highestRating.length === 0) {
        return res.status(404).json({ error: 'No testimonials found' });
      }
  
      res.status(200).json({
        message: 'Highest rating testimonial fetched successfully',
        testimonial: highestRating[0],
      });
    } catch (error) {
      console.error('Error fetching highest rating testimonial:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // Get lowest rating testimonial
  exports.getLowestRating = async (req, res) => {
    try {
      const lowestRating = await Testimonial.find()
        .sort({ rating: 1 }) // Sort by rating ascending
        .limit(1)
        .populate('student_id', 'name email') // Populate student_id
        .exec();
  
      if (lowestRating.length === 0) {
        return res.status(404).json({ error: 'No testimonials found' });
      }
  
      res.status(200).json({
        message: 'Lowest rating testimonial fetched successfully',
        testimonial: lowestRating[0],
      });
    } catch (error) {
      console.error('Error fetching lowest rating testimonial:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };