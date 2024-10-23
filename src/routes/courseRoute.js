const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const upload = require('../middlewares/uploadMiddleware'); // Multer middleware for image upload

// Routes for course management
router.get('/allcourses', courseController.getAllCourses); // GET all courses

router.post('/createcourse', 
    upload.single('image'), 
    courseController.createCourse); // POST create a new course with image

router.get('/courses/:id',
    courseController.getCourseById); // GET a specific course by ID

router.put('/updatecourse/:id', upload.single('image'), courseController.updateCourse); // PUT update a specific course by ID

router.delete('/deletecourse/:id', courseController.deleteCourse); // DELETE a specific course by ID
// Route to get a single course from each class
router.get('/singleCoursePerClass', courseController.getSingleCourseFromEachClass);

module.exports = router;
