const mongoose = require("mongoose"); // Import mongoose
const Teacher = require("../models/teacherModel");
const Subject = require("../models/subjectModel");
const moment = require("moment"); // Import teacher model

// Get Teacher by ID
exports.getTeacherById = async (req, res) => {
  const { id } = req.params;

  console.log(`Received request to get teacher with user_id: ${id}`);

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Find the teacher by user_id and populate subject name
    const teacher = await Teacher.findById(id).populate(
      "subject",
      "subject_name"
    );

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    console.log(`Authenticated User Role: ${req.user.role}`);
    console.log(`Authenticated User ID: ${req.user._id}`);
    console.log(`Teacher's User ID: ${teacher.user_id}`);

    if (
      req.user.role === "admin" ||
      teacher.user_id.toString() === req.user._id.toString()
    ) {
      return res.status(200).json({ teacher });
    } else {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
  } catch (error) {
    console.error(`Error fetching teacher by user_id (${id}):`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get All Teachers
exports.getAllTeachers = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }

    const teachers = await Teacher.find().populate({
      path: "user_id",
      select: "name email",
    });

    res.status(200).json({ teachers });
  } catch (error) {
    console.error("Error fetching all teachers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getTeachersBySubjectId = async (req, res) => {
  try {
    const { subject } = req.params;
    console.log("Received subject parameter:", subject); // Log the received subject ID

    // Directly match the string value of `subject` in the query
    const teachers = await Teacher.find({ subject: subject })
      .populate("user_id", "name email") // Populate user details if needed
      .populate("subject", "subject_name"); // Populate subject details if needed

    if (!teachers || teachers.length === 0) {
      return res
        .status(404)
        .json({ error: "No teachers found for this subject" });
    }

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers by subject_id:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getTeacherSchedule = async (req, res) => {
  try {
    const { id } = req.params; // Extract teacher ID from request parameters

    // Find the teacher by their ID and select the 'schedule' field
    const teacher = await Teacher.findById(id).select("schedule");

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Check if the schedule array exists and has data
    if (!teacher.schedule || teacher.schedule.length === 0) {
      return res.status(200).json({
        message: "No schedule found for the teacher",
        schedule: [],
      });
    }

    // Return the updated schedule with meeting details
    res.status(200).json({
      message: "Teacher schedule fetched successfully",
      schedule: teacher.schedule.map((item) => ({
        date: item.date,
        meeting_url: item.meeting_url,
        meeting_title: item.meeting_title,
        meeting_id: item.meeting_id,
      })),
    });
  } catch (error) {
    console.error("Error fetching teacher schedule:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update Teacher Details
exports.updateTeacherDetails = async (req, res) => {
  const { id } = req.params; // Extract teacher ID from params

  try {
    const { bio, language, available_time, subject_id } = req.body;

    // Validate and retrieve subject details if provided
    let subjectDetails = null;
    if (subject_id) {
      subjectDetails = await Subject.findById(subject_id);
      if (!subjectDetails) {
        return res.status(404).json({ error: "Subject not found" });
      }
    }

    // Prepare the updates object
    const updates = {
      bio,
      language,
      available_time,
    };

    // If subject is valid, add it to the updates
    if (subjectDetails) {
      updates.subject = {
        id: subjectDetails._id,
        name: subjectDetails.subject_name,
      };
    }

    // Query the teacher by `user_id` and update
    const updatedTeacher = await Teacher.findOneAndUpdate(
      { user_id: id }, // Query by `user_id`
      { $set: updates },
      { new: true, runValidators: true } // Return updated document
    );

    if (!updatedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Fetch the updated teacher with subject details populated
    const teacherWithSubject = await Teacher.findOne({ user_id: id });

    res.status(200).json({
      message: "Teacher details updated successfully",
      teacher: {
        ...teacherWithSubject.toObject(),
        subject: {
          id: teacherWithSubject.subject.id,
          name: teacherWithSubject.subject.name, // Correctly fetching subject name
        },
      },
    });
  } catch (error) {
    console.error("Error updating teacher details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get teachers with more than 3 years of experience
exports.getExperiencedTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({
      experience: { $gt: "3" }, // Adjust based on the data type of experience
    })
      .populate("user_id", "name email")
      .populate("class_id")
      .populate("subject")
      .populate("board_id")
      .exec(); // Populate user details if needed;

    res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Controller to get teacher details by auth_id from headers.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTeacherByAuthId = async (req, res) => {
  try {
    const authId = req.headers["auth_id"]; // Extract auth_id from headers

    if (!authId) {
      return res.status(400).json({ message: "auth_id header is required" });
    }

    // Find teacher by auth_id and populate related fields if necessary
    const teacher = await Teacher.findOne({ auth_id: authId })
      .populate("user_id", "name email") // Populate user details excluding sensitive fields
      .populate("class_id", "class_name") // Example: populate class details
      .populate("subject", "subject_name"); // Example: populate subject details

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      message: "Teacher retrieved successfully by auth_id",
      teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher by auth_id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.clockIn = async (req, res) => {
  const { teacherId, meetingId } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(teacherId) ||
      !mongoose.Types.ObjectId.isValid(meetingId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid teacherId or meetingId format" });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const attendance = teacher.attendance.find(
      (record) =>
        record.meeting_id.toString() === meetingId.toString() &&
        !record.clock_in_time
    );

    if (!attendance) {
      return res
        .status(404)
        .json({ error: "Attendance record not found or already clocked in" });
    }

    attendance.clock_in_time = moment().toDate();

    await teacher.save();

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
  const { teacherId, meetingId } = req.body; // Get teacherId and meetingId from request body
  try {
    // Check if the teacherId and meetingId are provided
    if (
      !mongoose.Types.ObjectId.isValid(teacherId) ||
      !mongoose.Types.ObjectId.isValid(meetingId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid teacherId or meetingId format" });
    }

    const teacher = await Teacher.findById(teacherId); // Find teacher by ID

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Log the attendance array and meetingId to debug
    console.log("Teacher Attendance:", teacher.attendance);
    console.log("Meeting ID:", meetingId);

    // Find the attendance record for the teacher and meeting
    const attendance = teacher.attendance.find((record) => {
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
    teacher.attendance.forEach((record) => {
      if (record.clock_in_time && record.clock_out_time) {
        const inTime = moment(record.clock_in_time);
        const outTime = moment(record.clock_out_time);
        totalWorkingHours += outTime.diff(inTime, "hours", true); // Accumulate total working hours
      }
    });

    // Update the teacher's working_hours field
    teacher.worked_hours = totalWorkingHours;

    // Save the updated teacher attendance
    await teacher.save();

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
