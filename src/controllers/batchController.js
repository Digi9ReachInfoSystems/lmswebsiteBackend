//src/controllers/batchController.js
const mongoose = require("mongoose");
const { error } = require("winston");
const Batch = require("../models/batchModel");
const Student = require("../models/studentModel");
const TypeOfBatch = require("../models/typeOfBatchModel"); // Adjust path as needed

// exports.createBatch = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const {
//       batch_name,
//       batch_image, // Expected to be a string (URL or file path)
//       subject_id,
//       class_id,
//       teacher_id,
//       students, // Array of student IDs
//       date,
//       type_of_batch
//     } = req.body;

//     // Validate required fields
//     if (
//       !batch_name ||
//       !subject_id ||
//       !class_id ||
//       !teacher_id ||
//       !students ||
//       !date||
//       !type_of_batch
//     ) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Ensure 'students' is an array
//     if (!Array.isArray(students)) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: "'students' must be an array of student IDs" });
//     }

//     // Validate all student IDs
//     const validStudentsCount = await Student.countDocuments({ _id: { $in: students } });
//     if (validStudentsCount !== students.length) {
//       throw new Error("One or more student IDs are invalid");
//     }

//     // Create the new Batch
//     const newBatch = new Batch({
//       batch_name,
//       batch_image,
//       subject_id,
//       class_id,
//       teacher_id,
//       students,
//       date,
//       type_of_batch
//     });

//     await newBatch.save({ session });

//     // Prepare the update for students using $addToSet to prevent duplicates
//     const bulkOps = students.map((studentId) => ({
//       updateOne: {
//         filter: { _id: studentId },
//         update: {
//           $addToSet: {
//             batch_creation: {
//               subject_id: subject_id,
//               status: true,
//             },
//           },
//         },
//       },
//     }));

//     // Execute bulk operations
//     const bulkWriteResult = await Student.bulkWrite(bulkOps, { session });

//     // Commit the transaction
//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({ message: "Batch created successfully" });
//   } catch (error) {
//     // Abort the transaction in case of error
//     await session.abortTransaction();
//     session.endSession();

//     console.error("Error creating batch:", error);

//     // Handle specific errors if necessary
//     if (error.name === "CastError") {
//       return res.status(400).json({ error: "Invalid ID format" });
//     }

//     res.status(500).json({ error: error.message || "Server error" });
//   }
// };



exports.createBatch = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      batch_name,
      batch_image,   // (string) URL or file path
      subject_id,    // The subject _id used for this batch
      class_id,
      teacher_id,
      students,      // Array of student _ids
      date,
      type_of_batch, // e.g. a TypeOfBatch reference
    } = req.body;

    // Validate required fields
    if (
      !batch_name ||
      !subject_id ||
      !class_id ||
      !teacher_id ||
      !students ||
      !type_of_batch
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "All fields are required." });
    }

    // Ensure 'students' is an array
    if (!Array.isArray(students)) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "'students' must be an array of student IDs." });
    }

    // Validate all student IDs
    const validStudentsCount = await Student.countDocuments({
      _id: { $in: students },
    }).session(session);

    if (validStudentsCount !== students.length) {
      throw new Error("One or more student IDs are invalid.");
    }
    const currentDate = new Date();
    const nextYear = currentDate.getFullYear() + 1;
    // monthIndex = 1 => February (0-based month in JS), day = 1 => Feb 1.
    const nextFeb = new Date(nextYear, 1, 1);

    // Create and save the new Batch
    const newBatch = new Batch({
      batch_name,
      batch_image,
      subject_id,
      class_id,
      teacher_id,
      students,
      date:nextFeb,
      type_of_batch,
    });

    await newBatch.save({ session });

    // For each student, update their subject array subdoc + batch_creation
    for (const studentId of students) {
      // 1) Find the student document
      const studentDoc = await Student.findOne({ _id: studentId }).session(
        session
      );

      if (!studentDoc) {
        throw new Error(`Student not found: ${studentId}`);
      }

      // 2) Find the matching subject subdoc in the student's subject_id array
      const subdoc = studentDoc.subject_id.find(
        (sub) => sub._id.toString() === subject_id.toString()
      );

      if (!subdoc) {
        // If subdoc doesn't exist, you might decide to throw an error
        // or skip. We'll throw an error for strictness.
        throw new Error(
          `Subject ${subject_id} not found in student ${studentId}'s subject_id array.`
        );
      }

      // 3) Retrieve the duration from the subdoc
      //    This is presumably in months.
      const durationValue = parseInt(subdoc.duration, 10) || 0;

      // 4) Compute expiry date from 'today + duration (months)'
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + durationValue);

      // 5) Update the subdoc fields
      subdoc.batch_id = newBatch._id;
      subdoc.batch_assigned = true;
      subdoc.batch_expiry_date = expiryDate;
      subdoc.batch_status = "active";

      // 6) Update or push to `batch_creation` array
      //    We'll do an "add if not present" approach.
      const alreadyInBatchCreation = studentDoc.batch_creation.some(
        (bc) => bc.subject_id.toString() === subject_id.toString()
      );
      if (!alreadyInBatchCreation) {
        studentDoc.batch_creation.push({
          subject_id,
          status: true, // or whichever logic for "active"
        });
      }

      // 7) Save changes for this student
      await studentDoc.save({ session });
    }

    // If all updates succeed, commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Batch created successfully." });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating batch:", error);

    // Check specific errors
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format." });
    }

    res.status(500).json({ error: error.message || "Server error." });
  }
};
// src/controllers/batchController.js

exports.getAllBatches = async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      teacher_id,
      students,
      sort_by,
      page = 1,
      limit = 100,
    } = req.query;

    // Build a query object
    let query = {};

    // Filter by date range
    if (start_date && end_date) {
      query.start_date = {
        $gte: new Date(start_date),
        $lte: new Date(end_date),
      };
    } else if (start_date) {
      query.start_date = { $gte: new Date(start_date) };
    } else if (end_date) {
      query.start_date = { $lte: new Date(end_date) };
    }

    // Filter by teacher_id and students
    if (teacher_id) {
      query.teacher_id = teacher_id;
    }
    if (students) {
      query.students = students;
    }

    // Build sort object
    let sort = {};
    if (sort_by === "newest") {
      sort.date = -1;
    } else if (sort_by === "oldest") {
      sort.date = 1;
    } else if (sort_by === "start_date_asc") {
      sort.start_date = 1;
    } else if (sort_by === "start_date_desc") {
      sort.start_date = -1;
    }

    // Pagination options with nested population for user details in teacher and students
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: [
        {
          path: "teacher_id",
          populate: { path: "user_id", select: "name email" },
        },
        {
          path: "students",
          populate: { path: "user_id", select: "name email" },
        },
        {
          path: "subject_id",
          populate: { path: "_id", select: "subject_name" },
        },
        {
          path: "class_id",
          populate: { path: "_id", select: "className classLevel curriculum" },
        },
      ],
    };

    // Execute the query with pagination
    const batches = await Batch.paginate(query, options);

    // Modify the batch response to include student count
    const modifiedBatches = batches.docs.map((batch) => ({
      ...batch.toObject(), // Convert Mongoose document to plain JS object
      studentcount: batch.students ? batch.students.length : 0, // Add student count
    }));

    res.status(200).json({
      message: "Batches fetched successfully",
      batches: modifiedBatches,
      totalPages: batches.totalPages,
      currentPage: batches.page,
    });
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Controller function to get all batches without pagination
exports.getAllBatchesNoFilter = async (req, res) => {
  try {
    // Fetch all batches and populate the teacher and students
    const batches = await Batch.find()
      .populate({ path: "teacher_id", select: "user_id.name " })
      // .populate({ path: "students", select: "name email" })
      .sort({ start_date: 1 }); // Sort by start_date ascending

    res.status(200).json({
      success: true,
      message: "Batches fetched successfully",
      data: batches,
    });
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
      error: error.message,
    });
  }
};

exports.getBatchesByTeacherId = async (req, res) => {
  try {
    // Check if the user's role is 'teacher'
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied: Not a teacher" });
    }

    // const teacherId = req.user._id; // Use authenticated user's ID
    const teacherId = req.params.teacherId;

    // Find batches where the teacher ID matches
    const batches = await Batch.find({ teacher_id: teacherId })
      .populate("students") // Populate students details if needed
      .populate("subject_id")
      .populate("class_id")
      .populate({
        path: "teacher_id",
        populate: { path: "user_id", select: "name email" },
      })
      .exec();

    // Check if any batches are found
    if (!batches || batches.length === 0) {
      return res
        .status(404)
        .json({ message: "No batches found for this teacher" });
    }

    // Send the found batches as a response
    res.status(200).json(batches);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Server error", error });
  }
};




/**
 * Controller function to get a single batch by its ID
// */
exports.getBatchById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the presence of the batch ID
    if (!id) {
      return res.status(400).json({ message: "Batch ID is required" });
    }

    // Find the batch by ID and populate related fields
    const batch = await Batch.findById(id)
      .populate({
        path: "teacher_id",
        populate: { path: "user_id", select: "name email" },
      })
      .populate({
        path: "students",
        populate: { path: "user_id", select: "name email" },
      })
      .populate({
        path: "subject_id",
        select: "subject_name",
      })
      .populate({
        path: "class_id",
        select: "className classLevel curriculum",
      });

    // If the batch is not found, return a 404 error
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Convert the Mongoose document to a plain JavaScript object
    const batchObj = batch.toObject();

    // Add a student count to the batch object
    batchObj.studentcount = batch.students ? batch.students.length : 0;

    // Respond with the batch details
    res.status(200).json({
      message: "Batch fetched successfully",
      batch: batchObj,
    });
  } catch (error) {
    console.error("Error fetching batch:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//  get bathes by student id
exports.getBatchesByStudentId = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Find batches where the student ID is in the students array
    const batches = await Batch.find({ students: studentId })
      .populate({
        path: "teacher_id",
        populate: { path: "user_id", select: "name email" },
      })
      .populate("subject_id")
      .populate("class_id")
      .populate({
        path: "students",
        populate: { path: "user_id", select: "name email" },
      })
      .exec();

    // Send the found batches as a response
    res.status(200).json(batches);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Server error", error });
  }
};



/**
 * Add one or multiple students to an existing batch
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with success or error message
 */
exports.addStudentsToBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { studentIds } = req.body;

    // Validate batchId
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ error: 'Invalid batch ID.' });
    }

    // Validate studentIds
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'studentIds must be a non-empty array.' });
    }

    // Validate each studentId
    for (const id of studentIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: `Invalid student ID: ${id}` });
      }
    }

    // Find the batch
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    // Check if students exist
    const existingStudents = await Student.find({ _id: { $in: studentIds } });
    const existingStudentIds = existingStudents.map(student => student._id.toString());

    const nonExistentStudents = studentIds.filter(id => !existingStudentIds.includes(id));
    if (nonExistentStudents.length > 0) {
      return res.status(404).json({ error: `Students not found: ${nonExistentStudents.join(', ')}` });
    }

    // Add students to the batch using $addToSet to prevent duplicates
    batch.students = [...new Set([...batch.students.map(id => id.toString()), ...studentIds])].map(id => new mongoose.Types.ObjectId(id));
  
    // Save the updated batch
    await batch.save();

    // Optionally, populate the students field to return detailed information
    await batch.populate('students', 'name email'); // Adjust fields as necessary

    return res.status(200).json({
      message: 'Student(s) added to the batch successfully.',
      batch,
    });
  } catch (error) {
    console.error('Error adding students to batch:', error);
    return res.status(500).json({ error: 'An error occurred while adding students to the batch.' });
  }
};



// // Get batches by authenticated teacher ID
// exports.getBatchesByTeacherId = async (req, res) => {
//   try {
//     // Check if the user's role is 'teacher'
//     if (req.user.role !== "teacher") {
//       return res.status(403).json({ message: "Access denied: Not a teacher" });
//     }

//     // const teacherId = req.user._id; // Use authenticated user's ID
//     const teacherId = req.params.teacherId;

//     // Find batches where the teacher ID matches
//     const batches = await Batch.find({ teacher_id: teacherId })
//       .populate("students") // Populate students details if needed
//       .exec();

//     // Check if any batches are found
//     if (!batches || batches.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No batches found for this teacher" });
//     }

//     // Send the found batches as a response
//     res.status(200).json(batches);
//   } catch (error) {
//     // Handle errors
//     res.status(500).json({ message: "Server error", error });
//   }
// };
