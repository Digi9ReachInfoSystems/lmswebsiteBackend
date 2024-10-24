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
        const student = await Student.findOne({ student_id: id }); // Populate user data

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

// Controller to get the number of students subscribed and not subscribed
exports.getStudentSubscriptionStats = async (req, res) => {
    try {
        // Count students who are subscribed (is_paid: true)
        const subscribedCount = await Student.countDocuments({ is_paid: true });

        // Count students who are not subscribed (is_paid: false)
        const notSubscribedCount = await Student.countDocuments({ is_paid: false });

        // Prepare response data
        const responseData = {
            subscribed: subscribedCount,
            notSubscribed: notSubscribedCount,
        };

        // Send response
        res.status(200).json({
            message: "Student subscription statistics fetched successfully",
            data: responseData,
        });
    } catch (error) {
        console.error('Error fetching student subscription statistics:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.getPaymentStatusChartData = async (req, res) => {
    try {
        let { year, month, day } = req.query; // Extract year, month, day from query parameters

        // Construct the date range based on the provided filters
        const matchConditions = {};
        year=year?parseInt(year):null;
        month=month?parseInt(month):null;   
        day=day?parseInt(day):null;
        if (year) {
            // year+=1;
            matchConditions.created_at = { $gte: new Date(`${year}-01-01`), $lt: new Date(`${(year+1)}-01-01`) }; // Start of the year
        }
        if (year && month) {
            matchConditions.created_at = { $gte: new Date(`${year}-${month}-01`), $lt: new Date(`${year}-${(month + 1)}-01`) }; // Start of the month
        }
        if (year && month && day) {
            matchConditions.created_at = { $gte: new Date(`${year}-${month}-${day}`), $lt: new Date(`${year}-${month}-${(day + 1)}`) }; // Specific day
        }

        // Query to get the count of students created grouped by creation date
        const studentsData = await Student.aggregate([
            {
                $match: matchConditions, // Match the date conditions
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$created_at" } // Group by formatted date
                    },
                    paidCount: { $sum: { $cond: ["$is_paid", 1, 0] } }, // Count of paid students
                    unpaidCount: { $sum: { $cond: ["$is_paid", 0, 1] } }, // Count of unpaid students
                },
            },
            {
                $sort: { "_id": 1 } // Sort by date
            }
        ]);

        // Prepare the response data
        const xData = []; // Date labels
        const yData = []; // Count of students

        studentsData.forEach(item => {
            xData.push(item._id); // Push created date
            yData.push({ paid: item.paidCount, unpaid: item.unpaidCount }); // Push counts of paid and unpaid
        });

        res.status(200).json({
            message: 'Chart data fetched successfully',
            xData,
            yData,
        });
    } catch (error) {
        console.error('Error fetching payment status chart data:', error);
        res.status(500).json({ error: 'Server error' });
    }
};