const mongoose = require("mongoose");
const Student = require("../models/studentModel");
const Class = require("../models/classModel");
const Package = require("../models/packagesModel");
const Subject = require("../models/subjectModel");
const CustomPackage = require("../models/customPackageModels");
const moment = require("moment"); // Import teacher model

// Create Student Controller
exports.createStudent = async (req, res) => {
  try {
    const { auth_id, user_id, student_id, role } = req.body;

    // Validate role
    if (!["student", "admin"].includes(role)) {
      return res
        .status(400)
        .json({ error: "Invalid role. Must be student or admin." });
    }

    // Validate ObjectId for student_id
    if (!mongoose.Types.ObjectId.isValid(student_id)) {
      return res.status(400).json({ error: "Invalid student_id format." });
    }

    // Check if auth_id or student_id already exists
    const existingStudent = await Student.findOne({
      $or: [{ auth_id }, { student_id }],
    });

    if (existingStudent) {
      return res.status(409).json({
        error: "Student with this auth_id or student_id already exists.",
      });
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
      message: "Student created successfully",
      student: savedStudent,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  const { id } = req.params;

  // Validate if ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid student ID format." });
  }

  try {
    const student = await Student.findById(id)
      .populate('user_id', 'name email') // Populate user details excluding sensitive fields  
      .populate('class', 'className classLevel')// Example: populate class details
      .populate('subject_id', 'subject_name') // Example: populate subject details
      .populate('board_id', 'name'); // Populate user data

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate({
      path: "user_id",
      select: "name email mobile_number role", // Specify fields to return
    })
      .populate('board_id')
      .populate('class'); // Populate user data
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  // Validate if ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid student ID format." });
  }

  try {
    const deletedStudent = await Student.findOneAndDelete({ student_id: id });

    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Internal server error" });
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
    console.error("Error fetching student subscription statistics:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getStudentsBySubjectAndClassId = async (req, res) => {
  try {
    const { subject_id, class_id } = req.params; // Extract subject_id and class_id from URL parameters

    // Find students with the matching subject_id and class_id
    const students = await Student.find({
      subject_id: subject_id, // Match subject_id in the subject_id array
      class: class_id, // Match class_id in the class object
    })
      .populate("user_id", "name email") // Populate user details if needed
      .populate("subject_id", "subject_name"); // Populate subject details if needed
    //   .populate("class_id", "name classLevel"); // Populate class details if needed

    if (!students || students.length === 0) {
      return res
        .status(404)
        .json({ error: "No students found for this subject and class" });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students by subject and class:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPaymentStatusChartData = async (req, res) => {
  try {
    let { year, month, day } = req.query; // Extract year, month, and day from query parameters

    const matchConditions = {};
    year = year ? parseInt(year) : null;
    month = month ? parseInt(month) : null;
    day = day ? parseInt(day) : null;

    // Build the date filter conditions based on query parameters
    if (year && month && day) {
      matchConditions.created_at = {
        $gte: new Date(`${year}-${month}-${day}`),
        $lt: new Date(`${year}-${month}-${day + 1}`),
      };
    } else if (year && month) {
      matchConditions.created_at = {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(`${year}-${month + 1}-01`),
      };
    } else if (year) {
      matchConditions.created_at = {
        $gte: new Date(`${year}-01-01`),
        $lt: new Date(`${year + 1}-01-01`),
      };
    } else if (month) {
      matchConditions.created_at = {
        $gte: new Date(`1970-${month}-01`), // Use a dummy year
        $lt: new Date(`2300-${month + 1}-01`),
      };
    }

    // Query to aggregate student data by creation date
    const studentsData = await Student.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: {
            $cond: [
              { $and: [year, month, day] },
              { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
              {
                $cond: [
                  { $and: [year, month] },
                  {
                    $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
                  },
                  {
                    $cond: [
                      year,
                      {
                        $dateToString: { format: "%Y-%m", date: "$created_at" },
                      },
                      { $dateToString: { format: "%m", date: "$created_at" } },
                    ],
                  },
                ],
              },
            ],
          },
          paidCount: { $sum: { $cond: ["$is_paid", 1, 0] } },
          unpaidCount: { $sum: { $cond: ["$is_paid", 0, 1] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Prepare response data
    const xData = studentsData.map((item) => item._id); // Extract date labels
    const yData = studentsData.map((item) => ({
      paid: item.paidCount,
      unpaid: item.unpaidCount,
    }));

    // Send response
    res.status(200).json({
      message: "Chart data fetched successfully",
      xData,
      yData,
    });
  } catch (error) {
    console.error("Error fetching payment status chart data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Update a student by ID and update their class by class_id.
 * @param {Object} req - The request object containing params and body.
 * @param {Object} res - The response object to send the result.
 */
exports.updateStudent = async (req, res) => {
  const { studentId } = req.params; // Get student ID from route params
  const { class_id, updateData } = req.body; // Extract class_id and other update data
 console.log(req.body);
 console.log(updateData);
  try {
    // Find the student by ID
    let student = await Student.findById( studentId );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // If class_id is provided, find the class in the Class collection
    if (class_id) {
      const classInfo = await Class.findById(class_id);
      if (!classInfo) {
        return res.status(404).json({ error: "Class not found" });
      }

      // Update the class information in the student document
      student.class = {
        _id: classInfo._id,
        name: classInfo.className,
        classLevel: classInfo.classLevel,
      };
    }

    // Update other fields only if provided in the request body
    student.auth_id = updateData.auth_id || student.auth_id;
    student.student_id = updateData.student_id || student.student_id;
    student.user_id = updateData.user_id || student.user_id;
    student.subscribed_Package =
      updateData.subscribed_Package || student.subscribed_Package;
    student.is_paid =
      updateData.is_paid !== undefined ? updateData.is_paid : student.is_paid;
    student.subscription_id =
      updateData.subscription_id || student.subscription_id;
    student.payment_id = updateData.payment_id || student.payment_id;
    student.last_online = updateData.last_online || student.last_online;
    student.phone_number = updateData.phone_number || student.phone_number;
    student.type_of_batch = updateData.type_of_batch || student.type_of_batch;
    student.duration = updateData.duration || student.duration;
    // Save the updated student
    const updatedStudent = await student.save();

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.getStudentByAuthId = async (req, res) => {
  try {
    const authId = req.headers['auth_id']; // Extract auth_id from headers

    if (!authId) {
      return res.status(400).json({ message: 'auth_id header is required' });
    }

    const student = await Student.findOne({ auth_id: authId })
      .populate('user_id', 'name email') // Populate user details excluding sensitive fields  
      .populate('class', 'className classLevel')// Example: populate class details
      .populate('subject_id', 'subject_name') // Example: populate subject details
      .populate('board_id', 'name') // Example: populate board details
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Student retrieved successfully by auth_id',
      student,
    })

  } catch (error) {
    console.error('Error fetching student by auth_id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.getStudentsByClassId = async (req, res) => {
  try {
    const { class_id } = req.params; // Extract class_id from URL parameters

    // Validate if class_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(class_id)) {
      return res.status(400).json({ error: "Invalid class ID format." });
    }

    // Find students with the matching class_id
    const students = await Student.find({ 'class': class_id })
      .populate('user_id', 'name email') // Populate user details if needed
      .populate('class', 'className classLevel'); // Populate class details if needed

    if (!students || students.length === 0) {
      return res.status(404).json({ error: "No students found for this class" });
    }

    res.status(200).json({
      message: "Students retrieved successfully",
      students,
    });
  } catch (error) {
    console.error("Error fetching students by class:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getStudentSchedule = async (req, res) => {
  try {
    const { id } = req.params; // Extract teacher ID from request parameters

    // Find the teacher by their ID and select the 'schedule' field
    const student = await Student.findById(id).select("schedule");


    if (!student) {
      return res.status(404).json({ error: "student not found" });
    }

    // Check if the schedule array exists and has data
    if (!student.schedule || student.schedule.length === 0) {
      return res.status(200).json({
        message: "No schedule found for the student",
        schedule: [],
      });
    }

    // Return the updated schedule with meeting details
    res.status(200).json({
      message: "student schedule fetched successfully",
      schedule: student.schedule.map((item) => ({
        date: item.date,
        meeting_url: item.meeting_url,
        meeting_title: item.meeting_title,
        meeting_id: item.meeting_id,
        meeting_reschedule: item.meeting_reschedule,
      })),
    });
  } catch (error) {
    console.error("Error fetching student schedule:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.clockIn = async (req, res) => {
  const { studentId, meetingId } = req.body;

  try {
    // Validate teacherId and meetingId
    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(meetingId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid studentId or meetingId format" });
    }

    // Find teacher by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: "student not found" });
    }

    const meeting = student.schedule.find(scheduleItem =>
      scheduleItem?.meeting_id?.toString() === meetingId.toString()
    );
    // Find attendance record based on meetingId
    let attendance = student.attendance.find(
      (record) => record.meeting_id.toString() === meetingId.toString()
    );

    // If attendance record exists but already clocked in
    if (attendance && attendance.clock_in_time) {
      return res.status(400).json({
        error: "Attendance for this meeting has already been clocked in",
      });
    }

    // If attendance record does not exist, create one
    if (!attendance) {
      attendance = {
        meeting_id: meetingId,
        clock_in_time: moment().toDate(), // Set current time as clock-in time
        clock_out_time: null, // Initialize clock_out_time as null
        meeting_title: meeting.meeting_title,
      };

      // Push the new attendance record to the teacher's attendance array
      student.attendance.push(attendance);
    } else {
      // If attendance exists but hasn't been clocked in, update the clock_in_time
      attendance.clock_in_time = moment().toDate();
    }

    // Save the updated teacher document
    await student.save();

    res.status(200).json({
      message: "Clock-in successful",
      attendance,
    });
  } catch (error) {
    console.error("Error during clock-in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Clock-Out Method
exports.clockOut = async (req, res) => {
  const { studentId, meetingId } = req.body; // Get teacherId and meetingId from request body
  console.log(req.body);
  try {
    // Check if the teacherId and meetingId are provided
    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(meetingId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid studentId or meetingId format" });
    }

    const student = await Student.findById(studentId); // Find teacher by ID

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Log the attendance array and meetingId to debug
    console.log("student Attendance:", student.attendance);
    console.log("Meeting ID:", meetingId);

    // Find the attendance record for the teacher and meeting
    const attendance = student.attendance.find((record) => {
      console.log("Checking record:", record); // Log each record
      return (
        record.meeting_id &&
        record.meeting_id.toString() === meetingId.toString() &&
        !record.clock_out_time
      );
    });

    if (!attendance) {
      return res
        .status(404)
        .json({ error: "Attendance record not found or already clocked out" });
    }

    // Update the attendance record with clock_out_time
    attendance.clock_out_time = moment().toDate(); // Set the current time as clock_out_time

    // Calculate the working hours (difference between clock_in_time and clock_out_time)
    const clockInTime = moment(attendance.clock_in_time);
    const clockOutTime = moment(attendance.clock_out_time);
    const workingHours = clockOutTime.diff(clockInTime, "hours", true); // Returns hours as a decimal value

    // Update the teacher's total working hours
    let totalWorkingHours = 0;

    // Calculate total working hours from all attendance records
    student.attendance.forEach((record) => {
      if (record.clock_in_time && record.clock_out_time) {
        const inTime = moment(record.clock_in_time);
        const outTime = moment(record.clock_out_time);
        totalWorkingHours += outTime.diff(inTime, "hours", true); // Accumulate total working hours
      }
    });

    // Update the teacher's working_hours field
    student.worked_hours = totalWorkingHours;

    // Save the updated teacher attendance
    await student.save();

    res.status(200).json({
      message: "Clock-out successful",
      attendance: attendance,
      working_hours: totalWorkingHours,
    });
  } catch (error) {
    console.error("Error during clock-out:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// controllers/studentController.js

// controllers/studentController.js

// controllers/studentController.js

exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.query; // Extract student ID from request parameters

    if (studentId) {
      // If studentId is provided, fetch attendance for the specific student
      const student = await Student.findById(studentId).select("attendance");

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Check if the attendance array exists and has data
      if (!student.attendance || student.attendance.length === 0) {
        return res.status(200).json({
          message: "No attendance found for the student",
          attendance: [],
          classesAttended: 0, // Add count as 0
        });
      }

      // **Updated Calculation: Use 'clock_out_time' to determine attendance**
      const classesAttended = student.attendance.filter(item => item.clock_out_time !== null).length;

      // Return the student's attendance along with the count
      return res.status(200).json({
        message: "Student attendance fetched successfully",
        attendance: student.attendance.map((item) => ({
          date: item.Date, // Ensure this field exists and is correctly capitalized
          clock_in_time: item.clock_in_time,
          clock_out_time: item.clock_out_time,
          // Remove 'meeting_attended' as it doesn't exist
          meeting_id: item.meeting_id,
          meeting_title: item.meeting_title,
        })),
        classesAttended, // Include the count
      });
    } else {
      // If studentId is not provided, fetch attendance for all students
      const students = await Student.find()
        .select("attendance student_id")
        .populate({ path: "student_id", select: "name email" });

      if (!students || students.length === 0) {
        return res.status(200).json({
          message: "No students found",
          attendance: [],
        });
      }

      // Map through each student and their attendance, including the count
      const allAttendances = students.map((student) => {
        const classesAttended = student.attendance.filter(item => item.clock_out_time !== null).length;

        return {
          studentId: student._id,
          name: student.student_id?.name,
          email: student.student_id?.email,
          attendance: student.attendance.map((item) => ({
            date: item.Date, // Ensure correct field name
            clock_in_time: item.clock_in_time,
            clock_out_time: item.clock_out_time,

            meeting_id: item.meeting_id,
            meeting_title: item.meeting_title,
          })),
          classesAttended, // Include the count for each student
        };
      });

      return res.status(200).json({
        message: "All students' attendance fetched successfully",
        attendance: allAttendances,
      });
    }
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// exports.getStudentAttendance = async (req, res) => {
//   try {
//     const { studentId } = req.query; // Extract student ID from request parameters

//     if (studentId) {
//       // If studentId is provided, fetch attendance for the specific student
//       const student = await Student.findById(studentId).select("attendance");

//       if (!student) {
//         return res.status(404).json({ error: "Student not found" });
//       }

//       // Check if the attendance array exists and has data
//       if (!student.attendance || student.attendance.length === 0) {
//         return res.status(200).json({
//           message: "No attendance found for the student",
//           attendance: [],
//         });
//       }

//       // Return the student's attendance
//       return res.status(200).json({
//         message: "Student attendance fetched successfully",
//         attendance: student.attendance.map((item) => ({
//           date: item.Date,
//           clock_in_time: item.clock_in_time,
//           clock_out_time: item.clock_out_time,
//           meeting_attended: item.Meeting_attended,
//           meeting_id: item.meeting_id,
//           meeting_title: item?.meeting_title,
//         })),
//       });
//     } else {
//       // If studentId is not provided, fetch attendance for all students
//       const students = await Student.find().select("attendance").populate({ path: "student_id", select: "name email" });

//       if (!students || students.length === 0) {
//         return res.status(200).json({
//           message: "No students found",
//           attendance: [],
//         });
//       }

//       // Map through each student and their attendance
//       const allAttendances = students.map((student) => ({
//         studentId: student._id,
//         name: student.student_id?.name,
//         email: student.student_id?.email,
//         attendance: student.attendance.map((item) => ({
//           date: item.Date,
//           clock_in_time: item.clock_in_time,
//           clock_out_time: item.clock_out_time,
//           meeting_attended: item.Meeting_attended,
//           meeting_id: item.meeting_id,
//           meeting_title: item?.meeting_title,
//         })),
//       }));

//       return res.status(200).json({
//         message: "All students' attendance fetched successfully",
//         attendance: allAttendances,
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching student attendance:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };



// Controller function to get students with attendance data
exports.getStudentsWithAttendance = async (req, res) => {
  try {
    // Fetch all students who have at least one attendance entry and populate user details
    const studentsWithAttendance = await Student.find({
      "attendance.0": { $exists: true }
    })
      .select("user_id attendance") // Select the necessary fields
      .populate("user_id", "name email"); // Populate the user details (name and email)

    if (studentsWithAttendance.length === 0) {
      return res.status(404).json({ message: "No students found with attendance data." });
    }

    return res.status(200).json({
      message: "Students with attendance data fetched successfully.",
      students: studentsWithAttendance,
    });
  } catch (error) {
    console.error("Error fetching students with attendance:", error);
    res.status(500).json({ error: "Server error, unable to fetch students." });
  }
};

exports.updateModeToPersonal = async (req, res) => {
  try {
    // Extract the student's user ID from the authenticated user
    const student_id = req.body.student_id;

    // Find the student associated with this user ID
    const student = await Student.findById(student_id);

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    // Check if the mode is already 'personal'
    if (student.mode === "personal") {
      return res.status(400).json({ error: "Mode is already set to personal." });
    }

    // Update the mode to 'personal'
    student.mode = "personal";

    // Save the updated student document
    await student.save();

    // Respond with the updated student information
    res.status(200).json({
      message: "Student mode updated to personal successfully.",
      student,
    });
  } catch (error) {
    console.error("Error updating student mode:", error);
    res.status(500).json({ error: "Server error." });
  }
};

/**
 * Controller to get students for batch creation based on subject and mode.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
//  */
// exports.getStudentsforBatchBySubject = async (req, res) => {
//   try {
//     const { mode } = req.query; // Extract 'mode' from query parameters
//     const subjectId= new mongoose.Types.ObjectId(req.params.subjectId);
//     // Validate subjectId
//     if (!mongoose.Types.ObjectId.isValid(subjectId)) {
//       return res.status(400).json({ error: "Invalid subject ID" });
//     }

//     // Convert subjectId to ObjectId
//     const subjectObjectId =  new mongoose.Types.ObjectId(subjectId);

//     // Validate mode if provided
//     const validModes = ['normal', 'personal'];
//     if (mode && !validModes.includes(mode)) {
//       return res.status(400).json({ error: "Invalid mode value. Allowed values are 'normal' or 'personal'." });
//     }

//     // Verify that the subject exists
//     const subjectExists = await Subject.exists({ _id: subjectObjectId });
//     if (!subjectExists) {
//       return res.status(404).json({ error: "Subject not found" });
//     }

//     // Build the aggregation pipeline
//     const aggregationPipeline = [
//       {
//         $match: {
//           $or: [
//            { subscribed_Package: { $exists: true, $ne: null }, is_paid: true,},
//             { custom_package_id: { $exists: true, $ne: null }, custom_package_status: "approved" }
//           ]
//         }
//       },
//       // Lookup for subscribed_Package
//       {
//         $lookup: {
//           from: "packages",
//           localField: "subscribed_Package",
//           foreignField: "_id",
//           as: "subscribed_Package"
//         }
//       },
//       {
//         $unwind: {
//           path: "$subscribed_Package",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       // Lookup for custom_package
//       {
//         $lookup: {
//           from: "custompackages", // Ensure the collection name is correct
//           localField: "custom_package_id",
//           foreignField: "_id",
//           as: "custom_package"
//         }
//       },
//       {
//         $unwind: {
//           path: "$custom_package",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       // Match students where either subscribed_Package or custom_package contains the subject_id
//       {
//         $match: {
//           $or: [
//             { "subscribed_Package.subject_id": subjectObjectId },
//             { "custom_package.subject_id": subjectObjectId }
//           ]
//         }
//       },
//       // Ensure batch_creation does not already include this subject with status true
//       {
//         $match: {
//           $or: [
//             { batch_creation: { $exists: false } }, // No batch_creation field
//             { batch_creation: { $size: 0 } }, // Empty batch_creation array
//             {
//               batch_creation: {
//                 $not: {
//                   $elemMatch: {
//                     subject_id: subjectObjectId,
//                     status: true
//                   }
//                 }
//               }
//             }
//           ]
//         }
//       },
//     ];

//     // If mode is provided, add an additional match stage
//     if (mode) {
//       aggregationPipeline.push({
//         $match: {
//           mode: mode
//         }
//       });
//     }

//     // Continue with the rest of the pipeline
//     aggregationPipeline.push(
//       {
//         $lookup: {
//           from: "users",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "user"
//         }
//       },
//       {
//         $unwind: { path: "$user", preserveNullAndEmptyArrays: true }
//       },
//       {
//         $project: {
//           _id: 1,
//           auth_id: 1,
//           student_id: 1,
//           user_id: 1,
//           user: {
//             _id: 1,
//             name: 1,
//             email: 1,
//             // Add other user fields you want to include
//           },
//           subscribed_Package: 1,
//           is_paid: 1,
//           custom_package_status: 1,
//           batch_creation: 1,
//           role: 1,
//           created_at: 1,
//           last_online: 1,
//           mode: 1
//         }
//       }
//     );

//     // Execute the aggregation pipeline
//     const students = await Student.aggregate(aggregationPipeline);

//     // Return the aggregated students
//     return res.status(200).json({ students });
//   } catch (error) {
//     console.error("Error fetching students for batch creation:", error);
//     return res.status(500).json({ error: "Server error" });
//   }
// };



/**
 * Controller to fetch a student's schedule from today to the next 7 days.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getStudentScheduleNext7Days = async (req, res) => {
  try {
    const { id } = req.params; // Extract student ID from request parameters

    // Validate the ID format (optional but recommended)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid student ID format' });
    }

    // Find the student by their ID and select the 'schedule' field
    const student = await Student.findById(id).select('schedule');

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if the schedule array exists and has data
    if (!student.schedule || student.schedule.length === 0) {
      return res.status(200).json({
        message: 'No schedule found for the student',
        schedule: [],
      });
    }

    // Define the date range: today to next 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    sevenDaysFromNow.setHours(23, 59, 59, 999); // Set to end of the 7th day
    // Filter the schedule for entries within the date range
    const filteredSchedule = student.schedule.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= today && itemDate <= sevenDaysFromNow;
    });

    // Return the filtered schedule with meeting details
    res.status(200).json({
      message: 'Student schedule fetched successfully',
      schedule: filteredSchedule.map((item) => ({
        date: item.date,
        meeting_url: item.meeting_url,
        meeting_title: item.meeting_title,
        meeting_id: item.meeting_id,
        meeting_reschedule: item.meeting_reschedule,
      })),
    });
  } catch (error) {
    console.error('Error fetching student schedule for next 7 days:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


/**
 * Controller to get students for batch creation based on subject and mode.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

exports.getStudentsforBatchBySubject = async (req, res) => {
  try {
    const { mode } = req.query; // Extract 'mode' from query parameters
    const subjectId = req.params.subjectId;

    // Validate subjectId
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ error: "Invalid subject ID" });
    }

    const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

    // Validate mode if provided
    const validModes = ["normal", "personal"];
    if (mode && !validModes.includes(mode)) {
      return res.status(400).json({ error: "Invalid mode value. Allowed values are 'normal' or 'personal'." });
    }

    // Verify that the subject exists
    const subjectExists = await Subject.exists({ _id: subjectObjectId });
    if (!subjectExists) {
      return res.status(404).json({ error: "Subject not found" });
    }
    //  Basic Query: Find students with packages
    const studentStandard = await Student.aggregate([
      {
        $match: {
          $or: [
            {
              // Student has at least one subscribed package and is_paid = true
              is_paid: true,
              subscribed_Package: { $exists: true, $ne: [] }
            },
            {
              // Student has at least one custom package and status = "approved"
              custom_package_id: { $exists: true, $ne: [] },
              custom_package_status: "approved"
            }
          ]
        }
      },

      // Unwind subscribed_Package
      {
        $unwind: {
          path: "$subscribed_Package",
          preserveNullAndEmptyArrays: true
        }
      },
      // Only consider active standard packages
      {
        $match: {
          $or: [
            { "subscribed_Package.is_active": true },
            { subscribed_Package: { $eq: null } } // In case there's no subscribed package
          ]
        }
      },
      {
        $lookup: {
          from: "packages",
          localField: "subscribed_Package._id",
          foreignField: "_id",
          as: "subscribed_PackageDetail"
        }
      },
      {
        $unwind: {
          path: "$subscribed_PackageDetail",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          $or: [
            { "subscribed_PackageDetail.subject_id": subjectObjectId },

          ]
        }
      },
      {
        $match: {
          $or: [
            { batch_creation: { $exists: false } }, // No batch_creation field
            { batch_creation: { $size: 0 } }, // Empty batch_creation array
            {
              batch_creation: {
                $not: {
                  $elemMatch: {
                    subject_id: subjectObjectId,
                    status: true
                  }
                }
              }
            }
          ]
        }
      },
      {
        $match: {
          mode: mode
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 1,
          auth_id: 1,
          student_id: 1,
          user_id: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          subscribed_Package: 1,
          is_paid: 1,
          custom_package_status: 1,
          batch_creation: 1,
          role: 1,
          created_at: 1,
          last_online: 1,
          mode: 1
        }
      },
      // Group by student to consolidate if multiple packages matched
      {
        $group: {
          _id: "$_id",
          auth_id: { $first: "$auth_id" },
          student_id: { $first: "$student_id" },
          user_id: { $first: "$user_id" },
          user: { $first: "$user" },
          subscribed_Package: { $first: "$subscribed_Package" },
          is_paid: { $first: "$is_paid" },
          custom_package_status: { $first: "$custom_package_status" },
          batch_creation: { $first: "$batch_creation" },
          role: { $first: "$role" },
          created_at: { $first: "$created_at" },
          last_online: { $first: "$last_online" },
          mode: { $first: "$mode" }
        }
      }

    ])
    console.log("student data", studentStandard);
    const studentCustom = await Student.aggregate([
      {
        $match: {
          $or: [
            {
              // Student has at least one subscribed package and is_paid = true
              is_paid: true,
              subscribed_Package: { $exists: true, $ne: [] }
            },
            {
              // Student has at least one custom package and status = "approved"
              custom_package_id: { $exists: true, $ne: [] },
              custom_package_status: "approved"
            }
          ]
        }
      },
      // Unwind custom_package_id
      {
        $unwind: {
          path: "$custom_package_id",
          preserveNullAndEmptyArrays: true
        }
      },
      // Only consider active custom packages
      {
        $match: {
          $or: [
            { "custom_package_id.is_active": true },
            { custom_package_id: { $eq: null } } // In case there's no custom package
          ]
        }
      },
      {
        $lookup: {
          from: "custompackages",
          localField: "custom_package_id._id",
          foreignField: "_id",
          as: "custom_packageDetail"
        }
      },
      {
        $unwind: {
          path: "$custom_packageDetail",
          preserveNullAndEmptyArrays: true
        }
      },

      // Match students where either subscribed_PackageDetail or custom_packageDetail contains the subject_id
      {
        $match: {
          $or: [

            { "custom_packageDetail.subject_id": subjectObjectId }
          ]
        }
      },

      // Ensure batch_creation does not already include this subject with status true
      {
        $match: {
          $or: [
            { batch_creation: { $exists: false } }, // No batch_creation field
            { batch_creation: { $size: 0 } }, // Empty batch_creation array
            {
              batch_creation: {
                $not: {
                  $elemMatch: {
                    subject_id: subjectObjectId,
                    status: true
                  }
                }
              }
            }
          ]
        }
      },
      {
        $match: {
          mode: mode
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 1,
          auth_id: 1,
          student_id: 1,
          user_id: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          subscribed_Package: 1,
          is_paid: 1,
          custom_package_status: 1,
          batch_creation: 1,
          role: 1,
          created_at: 1,
          last_online: 1,
          mode: 1
        }
      },
      // Group by student to consolidate if multiple packages matched
      {
        $group: {
          _id: "$_id",
          auth_id: { $first: "$auth_id" },
          student_id: { $first: "$student_id" },
          user_id: { $first: "$user_id" },
          user: { $first: "$user" },
          subscribed_Package: { $first: "$subscribed_Package" },
          is_paid: { $first: "$is_paid" },
          custom_package_status: { $first: "$custom_package_status" },
          batch_creation: { $first: "$batch_creation" },
          role: { $first: "$role" },
          created_at: { $first: "$created_at" },
          last_online: { $first: "$last_online" },
          mode: { $first: "$mode" }
        }
      }
    ])
    console.log("student data", studentCustom.concat(studentStandard));
    // const aggregationPipeline = [
    //   {
    //     $match: {
    //       $or: [
    //         {
    //           // Student has at least one subscribed package and is_paid = true
    //           is_paid: true,
    //           subscribed_Package: { $exists: true, $ne: [] }
    //         },
    //         {
    //           // Student has at least one custom package and status = "approved"
    //           custom_package_id: { $exists: true, $ne: [] },
    //           custom_package_status: "approved"
    //         }
    //       ]
    //     }
    //   },

    //   // Unwind subscribed_Package
    //   {
    //     $unwind: {
    //       path: "$subscribed_Package",
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },
    //   // Only consider active standard packages
    //   {
    //     $match: {
    //       $or: [
    //         { "subscribed_Package.is_active": true },
    //         { subscribed_Package: { $eq: null } } // In case there's no subscribed package
    //       ]
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "packages",
    //       localField: "subscribed_Package._id",
    //       foreignField: "_id",
    //       as: "subscribed_PackageDetail"
    //     }
    //   },
    //   {
    //     $unwind: {
    //       path: "$subscribed_PackageDetail",
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },

    //   // Unwind custom_package_id
    //   {
    //     $unwind: {
    //       path: "$custom_package_id",
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },
    //   // Only consider active custom packages
    //   {
    //     $match: {
    //       $or: [
    //         { "custom_package_id.is_active": true },
    //         { custom_package_id: { $eq: null } } // In case there's no custom package
    //       ]
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "custompackages",
    //       localField: "custom_package_id._id",
    //       foreignField: "_id",
    //       as: "custom_packageDetail"
    //     }
    //   },
    //   {
    //     $unwind: {
    //       path: "$custom_packageDetail",
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },

    //   // Match students where either subscribed_PackageDetail or custom_packageDetail contains the subject_id
    //   {
    //     $match: {
    //       $or: [
    //         { "subscribed_PackageDetail.subject_id": subjectObjectId },
    //         { "custom_packageDetail.subject_id": subjectObjectId }
    //       ]
    //     }
    //   },

    //   // Ensure batch_creation does not already include this subject with status true
    //   {
    //     $match: {
    //       $or: [
    //         { batch_creation: { $exists: false } }, // No batch_creation field
    //         { batch_creation: { $size: 0 } }, // Empty batch_creation array
    //         {
    //           batch_creation: {
    //             $not: {
    //               $elemMatch: {
    //                 subject_id: subjectObjectId,
    //                 status: true
    //               }
    //             }
    //           }
    //         }
    //       ]
    //     }
    //   },
    // ];

    // // If mode is provided, add an additional match stage
    // if (mode) {
    //   aggregationPipeline.push({
    //     $match: {
    //       mode: mode
    //     }
    //   });
    // }

    // // Lookup user details
    // aggregationPipeline.push(
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "user_id",
    //       foreignField: "_id",
    //       as: "user"
    //     }
    //   },
    //   {
    //     $unwind: { path: "$user", preserveNullAndEmptyArrays: true }
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       auth_id: 1,
    //       student_id: 1,
    //       user_id: 1,
    //       "user._id": 1,
    //       "user.name": 1,
    //       "user.email": 1,
    //       subscribed_Package: 1,
    //       is_paid: 1,
    //       custom_package_status: 1,
    //       batch_creation: 1,
    //       role: 1,
    //       created_at: 1,
    //       last_online: 1,
    //       mode: 1
    //     }
    //   },
    //   // Group by student to consolidate if multiple packages matched
    //   {
    //     $group: {
    //       _id: "$_id",
    //       auth_id: { $first: "$auth_id" },
    //       student_id: { $first: "$student_id" },
    //       user_id: { $first: "$user_id" },
    //       user: { $first: "$user" },
    //       subscribed_Package: { $first: "$subscribed_Package" },
    //       is_paid: { $first: "$is_paid" },
    //       custom_package_status: { $first: "$custom_package_status" },
    //       batch_creation: { $first: "$batch_creation" },
    //       role: { $first: "$role" },
    //       created_at: { $first: "$created_at" },
    //       last_online: { $first: "$last_online" },
    //       mode: { $first: "$mode" }
    //     }
    //   }
    // );

    // // Execute the aggregation pipeline
    // const students = await Student.aggregate(aggregationPipeline);

    // Return the aggregated students
    // return res.status(200).json({ students });

    return res.status(200).json({ students: studentCustom.concat(studentStandard) });
  } catch (error) {
    console.error("Error fetching students for batch creation:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};
