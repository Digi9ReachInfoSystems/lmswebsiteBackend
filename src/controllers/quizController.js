// // src/controllers/quizController.js
// const mongoose = require('mongoose');
// const Quiz = require('../models/quizModel');
// // Create a new quiz (Accessible to any authenticated user)
// exports.createQuiz = async (req, res) => {
//   console.log(req.body);
//   try {
//     const {
//       quiz_title,
//       teacher_id,
//       batch_index,
//       class_level,
//       subject,
//       description,
//       dueDate,
//       questions,
//     } = req.body;

//     // Validate required fields
//     if (
//       !quiz_title ||
//       !teacher_id ||
//       !batch_index ||
//       !class_level ||
//       !subject ||
//       !questions ||
//       !Array.isArray(questions) ||
//       questions.length === 0
//     ) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Create a new quiz
//     const newQuiz = new Quiz({
//       quiz_title,
//       teacher_id,
//       batch_index,
//       class_level,
//       subject,
//       description, // Include the description
//       dueDate, // Include the due date
//       questions,
//       created_date: Date.now(), // Automatically set the current date/time
//     });

//     const savedQuiz = await newQuiz.save();

//     res.status(201).json({
//       message: 'Quiz created successfully',
//       quiz: savedQuiz,
//     });
//   } catch (error) {
//     console.error('Error creating quiz:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Get quizzes for a specific batch and class
// exports.getQuizzes = async (req, res) => {
//   try {
//     const { batch_index, class_level } = req.params;

//     const quizzes = await Quiz.find({
//       batch_index: batch_index,
//       class_level: class_level,
//     })
//       .populate('teacher_id', 'name email')
//       .populate('subject', 'subject_name')
//       .exec();

//     res.status(200).json({
//       message: 'Quizzes fetched successfully',
//       quizzes,
//     });
//   } catch (error) {
//     console.error('Error fetching quizzes:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Get a specific quiz by ID
// exports.getQuizById = async (req, res) => {
//   try {
//     const { quiz_id } = req.params;

//     const quiz = await Quiz.findById(quiz_id)
//       .populate('teacher_id', 'name email')
//       .populate('subject', 'subject_name')
//       .exec();

//     if (!quiz) {
//       return res.status(404).json({ error: 'Quiz not found' });
//     }

//     res.status(200).json({
//       message: 'Quiz fetched successfully',
//       quiz,
//     });
//   } catch (error) {
//     console.error('Error fetching quiz:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };


// /**
//  * Controller to get quizzes based on optional filters:
//  * - teacher_id
//  * - batch_id
//  * - class_id
//  * - subject_id
//  * 
//  * These filters are expected to be passed as query parameters.
//  * None of them are mandatory.
//  */
// exports.getQuizzesByTeacher = async (req, res) => {
//   try {
//     const { teacher_id, batch_id, class_id, subject_id } = req.query;

//     // Initialize an empty query object
//     let query = {};

//     // Validate and add teacher_id to query if provided
//     if (teacher_id) {
//       if (!mongoose.Types.ObjectId.isValid(teacher_id)) {
//         return res.status(400).json({ error: "Invalid teacher_id" });
//       }
//       query.teacher_id = teacher_id;
//     }

//     // Validate and add batch_id to query if provided
//     if (batch_id) {
//       if (!mongoose.Types.ObjectId.isValid(batch_id)) {
//         return res.status(400).json({ error: "Invalid batch_id" });
//       }
//       query.batch_index = batch_id;
//     }

//     // Validate and add class_id to query if provided
//     if (class_id) {
//       if (!mongoose.Types.ObjectId.isValid(class_id)) {
//         return res.status(400).json({ error: "Invalid class_id" });
//       }
//       query.class_level = class_id;
//     }

//     // Validate and add subject_id to query if provided
//     if (subject_id) {
//       if (!mongoose.Types.ObjectId.isValid(subject_id)) {
//         return res.status(400).json({ error: "Invalid subject_id" });
//       }
//       query.subject = subject_id;
//     }

//     // Execute the query without pagination
//     const quizzes = await Quiz.find(query)
//       .populate("teacher_id", "name email") // Populate teacher's name and email
//       .populate("batch_index", "batch_name") // Populate batch name
//       .populate("class_level", "className classLevel") // Populate class details
//       .populate({ path: "subject", select: "subject_name" }) // Populate subject name
//       .populate({
//         path: 'answered_by.student_id',
//         populate: { path: 'user_id', select: 'name email' },
//       })
//       .exec();

//     // Check if any quizzes are found
//     if (!quizzes || quizzes.length === 0) {
//       return res.status(404).json({ message: "No quizzes found matching the criteria" });
//     }

//     // Return the quizzes
//     res.status(200).json({
//       message: "Quizzes fetched successfully",
//       quizzes,
//     });
//   } catch (error) {
//     console.error("Error fetching quizzes:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.getQuizBySubjectId = async (req, res) => {
//   try {
//     const { subject_id } = req.params;
//     const quizzes = await Quiz.find({ subject: subject_id })
//       .populate('teacher_id', 'name email')
//       .populate('subject', 'subject_name')
//       .exec();
//     res.status(200).json({
//       message: 'Quizzes fetched successfully',
//       quizzes,
//     });
//   } catch (error) {
//     console.error('Error fetching quizzes:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.getQuizByBatchId = async (req, res) => {
//   try {
//     const { batch_id } = req.params;
//     const quizzes = await Quiz.find({ batch_index: batch_id })
//       .populate('teacher_id', 'name email')
//       .populate('subject', 'subject_name')
//       .exec();
//     res.status(200).json({
//       message: 'Quizzes fetched successfully',
//       quizzes,
//     });
//   } catch (error) {
//     console.error('Error fetching quizzes:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };



// src/controllers/quizController.js

const mongoose = require("mongoose");
const Quiz = require("../models/quizModel");
const Teacher = require("../models/teacherModel"); // Ensure correct path
const Batch = require("../models/batchModel");     // Ensure correct path
const Class = require("../models/classModel");     // Ensure correct path
const Subject = require("../models/subjectModel"); // Ensure correct path
const Student = require("../models/studentModel"); // Ensure correct path

/**
 * Controller to create a new quiz with optional images for questions.
 */
exports.createQuiz = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            quiz_title,
            teacher_id,
            batch_index,
            class_level,
            subject,
            description, // Optional
            dueDate,     // Optional
            questions,
            answered_by // Optional
        } = req.body;

        // Log incoming request for debugging
        console.log("Incoming Quiz Creation Request:", req.body);

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
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "All required fields must be provided." });
        }

        // Validate ObjectId formats
        const objectIdFields = { teacher_id, batch_index, class_level, subject };
        for (const [key, value] of Object.entries(objectIdFields)) {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ error: `Invalid ObjectId format for ${key}.` });
            }
        }

        // Validate teacher, batch, class, and subject exist
        const [teacher, batch, classLevel, subjectDoc] = await Promise.all([
            Teacher.findById(teacher_id).session(session),
            Batch.findById(batch_index).session(session),
            Class.findById(class_level).session(session),
            Subject.findById(subject).session(session),
        ]);

        if (!teacher) {
            throw new Error("Teacher not found.");
        }
        if (!batch) {
            throw new Error("Batch not found.");
        }
        if (!classLevel) {
            throw new Error("Class level not found.");
        }
        if (!subjectDoc) {
            throw new Error("Subject not found.");
        }

        // Validate each question
        for (const question of questions) {
            const { question_number, question_text, options, correct_option_id } = question;

            if (
                question_number === undefined ||
                !question_text ||
                !options ||
                !Array.isArray(options) ||
                options.length === 0 ||
                correct_option_id === undefined
            ) {
                throw new Error("Each question must have question_number, question_text, options, and correct_option_id.");
            }

            // Ensure correct_option_id exists in options
            const optionIds = options.map(opt => opt.option_id);
            if (!optionIds.includes(correct_option_id)) {
                throw new Error(`correct_option_id ${correct_option_id} does not exist in options for question_number ${question_number}.`);
            }

            // If image field exists, optionally validate the URL or path format
            if (question.image) {
                // Simple URL validation (you can enhance this as needed)
                const urlPattern = /^(http|https):\/\/[^ "]+$/;
                if (!urlPattern.test(question.image)) {
                    throw new Error(`Invalid image URL for question_number ${question_number}.`);
                }
            }
        }

        // If answered_by is provided, validate student_ids
        if (answered_by && Array.isArray(answered_by)) {
            for (const entry of answered_by) {
                const { student_id, score } = entry;
                if (!mongoose.Types.ObjectId.isValid(student_id)) {
                    throw new Error(`Invalid ObjectId format for student_id: ${student_id}`);
                }

                // Verify that the student exists
                const studentExists = await Student.findById(student_id).session(session);
                if (!studentExists) {
                    throw new Error(`Student not found with id: ${student_id}`);
                }

                // Validate the score (e.g., non-negative number)
                if (typeof score !== 'number' || score < 0) {
                    throw new Error(`Invalid score for student_id: ${student_id}`);
                }
            }
        }

        // Create the new Quiz
        const newQuiz = new Quiz({
            quiz_title,
            teacher_id,
            batch_index,
            class_level,
            subject,
            description,
            dueDate,
            questions,
            answered_by, // Optional
            created_date: new Date(),
        });

        await newQuiz.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Quiz created successfully.",
            quiz: newQuiz,
        });
    } catch (error) {
        // Abort the transaction on error
        try {
            await session.abortTransaction();
        } catch (abortError) {
            console.error("Error aborting transaction:", abortError);
        }
        session.endSession();

        console.error("Error creating quiz:", error);

        // Handle specific errors
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid ID format." });
        }

        res.status(500).json({ error: error.message || "Server error." });
    }
};

/**
 * Controller to get all quizzes for a specific batch and class.
 */
exports.getQuizzes = async (req, res) => {
    try {
        const { batch_index, class_level } = req.params;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(batch_index) || !mongoose.Types.ObjectId.isValid(class_level)) {
            return res.status(400).json({ error: "Invalid batch_index or class_level ObjectId format." });
        }

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

/**
 * Controller to get a specific quiz by its ID.
 */
exports.getQuizById = async (req, res) => {
    try {
        const { quiz_id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(quiz_id)) {
            return res.status(400).json({ error: "Invalid quiz_id ObjectId format." });
        }

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

/**
 * Controller to get quizzes by subject ID.
 */
exports.getQuizBySubjectId = async (req, res) => {
    try {
        const { subject_id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(subject_id)) {
            return res.status(400).json({ error: "Invalid subject_id ObjectId format." });
        }

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

/**
 * Controller to get quizzes by batch ID.
 */
exports.getQuizByBatchId = async (req, res) => {
    try {
        const { batch_id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(batch_id)) {
            return res.status(400).json({ error: "Invalid batch_id ObjectId format." });
        }

        const quizzes = await Quiz.find({ batch_index: batch_id })
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
