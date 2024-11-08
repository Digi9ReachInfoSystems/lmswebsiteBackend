const mongoose = require("mongoose"); // Import mongoose
const Teacher = require("../models/teacherModel");
const Subject = require("../models/subjectModel"); // Import teacher model

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
    const teacher = await Teacher.findOne({ user_id: id }).populate(
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
    });

    res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
