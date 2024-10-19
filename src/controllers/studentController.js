const mongoose = require('mongoose');
const Student = require('../models/studentModel');


// Create Student Controller
exports.createStudent = async (req, res) => {
    try {
        const { auth_id, user_id, student_id, role } = req.body;

        // Validate role
        if (!['student', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be student or admin.' });
        }

        // Validate ObjectId for student_id
        if (!mongoose.Types.ObjectId.isValid(student_id)) {
            return res.status(400).json({ error: 'Invalid student_id format.' });
        }

        // Check if auth_id or student_id already exists
        const existingStudent = await Student.findOne({
            $or: [{ auth_id }, { student_id }],
        });

        if (existingStudent) {
            return res.status(409).json({ error: 'Student with this auth_id or student_id already exists.' });
        }

        // Create new student
        const newStudent = new Student({
            auth_id,
            student_id: new mongoose.Types.ObjectId(student_id), // Use 'new' correctly
            user_id: new mongoose.Types.ObjectId(user_id),
            role,
        });

        const savedStudent = await newStudent.save();
        res.status(201).json({
            message: 'Student created successfully',
            student: savedStudent,
        });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
    const { id } = req.params;

    // Validate if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid student ID format.' });
    }

    try {
        const student = await Student.findOne({student_id: id}); // Populate user data

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find(); // Populate user data
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Delete a student by ID
exports.deleteStudent = async (req, res) => {
    const { id } = req.params;

    // Validate if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid student ID format.' });
    }

    try {
        const deletedStudent = await Student.findOneAndDelete({ student_id: id });

        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
