const express = require('express');
const router = express.Router();
const {
    createStudent,
    getStudentById,
    getAllStudents,
    updateStudent,
    deleteStudent,
} = require('../controllers/studentController');

// Route to create a new student
router.post('/createStudent', createStudent);

// Route to get a student by ID
router.get('/:id', getStudentById);

// Route to get all students
router.get('/', getAllStudents);

// Route to update a student by ID
// router.put('/:id', updateStudent);

// Route to delete a student by ID
router.delete('/:id', deleteStudent);

module.exports = router;
