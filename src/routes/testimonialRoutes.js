const express = require('express');
const testimonialController = require('../controllers/testimonialController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Ensure authentication if required
const authorizeRole = require('../middlewares/authorizeRole');

// Create a new testimonial
router.post('/', authMiddleware,authorizeRole("student"), testimonialController.createTestimonial);

// Get all testimonials
router.get('/', testimonialController.getAllTestimonials);

// Get a single testimonial by ID
router.get('/:testimonialId', testimonialController.getSingleTestimonial);

// Delete a testimonial by ID
router.delete('/:testimonialId', authMiddleware,authorizeRole("admin"), testimonialController.deleteTestimonial);
// Get highest rating testimonial
router.get('/highest/top', testimonialController.getHighestRating);

// Get lowest rating testimonial
router.get('/lowest/low', testimonialController.getLowestRating);

module.exports = router;
