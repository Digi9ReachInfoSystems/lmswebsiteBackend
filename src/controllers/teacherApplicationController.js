const TeacherApplication = require("../models/teacherApplicationModel");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const Teacher = require("../models/teacherModel");
const path = require("path");
const { bucket } = require("../services/firebaseService"); // Firebase bucket reference

exports.createTeacherApplication = async (req, res) => {
  try {
    const userId = req.user.uid; // From auth middleware
    const { state, city, pincode, current_position, language } = req.body;

    // Check for required fields and files
    if (
      !req.files || 
      !req.files.resume || 
      !req.files.profileImage || 
      !state || 
      !city || 
      !pincode || 
      !current_position || 
      !language
    ) {
      return res.status(400).json({ error: "All fields and files are required" });
    }

    // Find the user in the User collection
    const user = await User.findOne({ auth_id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has already applied
    const existingApplication = await TeacherApplication.findOne({
      teacher_id: user._id,
    });
    if (existingApplication) {
      return res.status(400).json({ error: "Application already submitted" });
    }

    // Generate unique filenames for Firebase Storage
    const resumeFileName = `resume/${uuidv4()}${path.extname(req.files.resume[0].originalname)}`;
    const profileImageFileName = `profile/${uuidv4()}${path.extname(req.files.profileImage[0].originalname)}`;

    // Upload resume to Firebase Storage
    const resumeUrl = await uploadFileToFirebase(req.files.resume[0], resumeFileName);
    if (!resumeUrl) {
      return res.status(500).json({ error: "Resume upload failed" });
    }

    // Upload profile image to Firebase Storage
    const profileImageUrl = await uploadFileToFirebase(req.files.profileImage[0], profileImageFileName);
    if (!profileImageUrl) {
      return res.status(500).json({ error: "Profile image upload failed" });
    }

    // Create a new TeacherApplication in MongoDB
    const teacherApplication = new TeacherApplication({
      teacher_id: user._id,
      resume_link: resumeUrl,
      profileImage: profileImageUrl,
      state,
      city,
      pincode,
      current_position,
      language,
    });

    await teacherApplication.save(); // Save to MongoDB

    // Return success response
    res.status(201).json({
      message: "Teacher application submitted successfully",
      application: teacherApplication,
    });
  } catch (error) {
    console.error("Error submitting teacher application:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Helper function to upload a file to Firebase Storage
async function uploadFileToFirebase(file, destination) {
  return new Promise((resolve, reject) => {
    const fileRef = bucket.file(destination);
    const blobStream = fileRef.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        firebaseStorageDownloadTokens: uuidv4(),
      },
    });

    blobStream.on("error", (error) => {
      console.error(`Error uploading file to Firebase: ${error}`);
      reject(null);
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
        destination
      )}?alt=media`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer); // Upload the file
  });
}


exports.getTeacherApplications = async (req, res) => {
  try {
    const { approval_status } = req.query;
    const query = {};

    // Validate approval_status
    const validStatuses = ["pending", "approved", "rejected"];

    if (approval_status) {
      if (!validStatuses.includes(approval_status)) {
        return res.status(400).json({ error: "Invalid approval_status value" });
      }
      query.approval_status = approval_status;
    }

    const applications = await TeacherApplication.find(query)
      .populate({
        path: "teacher_id",
        select: "name email role",
      })
      .sort({ date_applied: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching teacher applications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.approveTeacherApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Find the application
    const application = await TeacherApplication.findById(
      applicationId
    ).populate("teacher_id");
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Update application status
    application.approval_status = "approved";
    application.date_approved = new Date();
    await application.save();

    // Update user role to 'teacher'
    const user = await User.findById(application.teacher_id._id);
    user.role = "teacher";
    await user.save();

    // Check if a Teacher document already exists for this user
    const existingTeacher = await Teacher.findOne({ user_id: user._id });
    if (existingTeacher) {
      return res
        .status(400)
        .json({ error: "Teacher profile already exists for this user" });
    }

    // Create a new Teacher document
    const teacher = new Teacher({
      auth_id: user.auth_id,
      teacher_id: user.auth_id, // Assuming teacher_id is same as auth_id
      user_id: user._id,
      role: "teacher",
      qualifications: "", // Populate as needed
      bio: "", // Populate as needed
      approval_status: "approved",
      resume_link: application.resume_link,
      profile_image: application.profileImage, // Populate as needed
      payout_info: "", // Populate as needed
      subject: null, // Populate as needed
      last_online: new Date(),
      experience: "", // Populate as needed
      no_of_classes: 0, // Initialize to 0
      available_time: "", // Populate as needed
      language: "", // Populate as needed
      is_grammar_teacher: false, // Default value
    });

    await teacher.save();

    res.status(200).json({
      message: "Application approved and teacher profile created successfully",
      application,
      teacher,
    });
  } catch (error) {
    console.error("Error approving teacher application:", error);
    res.status(500).json({ error: "Server error" });
  }
};
