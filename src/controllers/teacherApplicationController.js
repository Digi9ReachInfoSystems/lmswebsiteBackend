const TeacherApplication = require("../models/teacherApplicationModel");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const Teacher = require("../models/teacherModel");
const path = require("path");
const { bucket } = require("../services/firebaseService"); // Firebase bucket reference
const mongoose = require("mongoose");
const axios = require("axios");
const nodemailer = require("nodemailer");
const admin=require('../services/firebaseService');

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "Info@gully2global.com",
    pass: "Shasudigi@217",
  },
});

exports.createTeacherApplication = async (req, res) => {
  try {
    // const userId = req.user.uid; // From auth middleware
    const {
      state,
      city,
      pincode,
      current_position,
      language,
      phone_number,
      experience,
      resume_link,
      board_id,
      class_id,
      subject_id,
      profileImage,
      qualifications,
      dateOfBirth,
      name,
      email,
    } = req.body;

    // Check for required fields and file links
    if (
      !resume_link ||
      !profileImage ||
      !state ||
      !city ||
      !pincode ||
      !current_position ||
      !language ||
      !phone_number ||
      !experience ||
      !board_id ||
      !class_id ||
      !subject_id ||
      !qualifications ||
      !dateOfBirth ||
      !name ||
      !email
    ) {
      return res
        .status(400)
        .json({ error: "All fields and file links are required" });
    }

    // Find the user in the User collection
    // const user = await User.findOne({ auth_id: userId });
    // if (!user) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    // // Check if the user has already applied
    // const existingApplication = await TeacherApplication.findOne({
    //   teacher_id: user._id,
    // });
    // if (existingApplication) {
    //   return res.status(400).json({ error: "Application already submitted" });
    // }

    // Create a new TeacherApplication in MongoDB
    const teacherApplication = new TeacherApplication({
      // teacher_id: user._id,
      resume_link,
      profileImage,
      state,
      city,
      pincode,
      current_position,
      language,
      experience,
      board_id,
      class_id,
      subject_id,
      phoneNumber: phone_number,
      dateOfBirth,
      qualifications,
      teacher_name: name,
      email,
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
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name
        }/o/${encodeURIComponent(destination)}?alt=media`;
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

const getAccessToken = async () => {
  const url = `https://login.microsoftonline.com/4a18f542-e76b-4e64-b11b-22cf887e4659/oauth2/v2.0/token`;
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: "4374176d-7f91-4d83-a5e7-c44d06d12726",
    client_secret: "2rY8Q~~uzeAvhdFbCjfI5TLR3T~GLdJWEAQoTdi9",
    scope: "https://graph.microsoft.com/.default",
  });

  const response = await axios.post(url, params);

  // Clean the token
  const token = response.data.access_token.trim().replace(/[\r\n]/g, "");
  return token;
};


// Helper functions
const sanitizeUserName = (name) => {
  return name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

const generateUniqueUserPrincipalName = async (sanitizedUserName, domain, token) => {
  const maxAttempts = 10; // Limit the number of attempts to prevent infinite loops

  for (let i = 0; i < maxAttempts; i++) {
    const randomNumber = Math.floor(100 + Math.random() * 900); // Generate a random 3-digit number
    const userPrincipalName = `${sanitizedUserName}${randomNumber}@${domain}`.toLowerCase();

    try {
      // Attempt to fetch the user from Microsoft Graph API
      await axios.get(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userPrincipalName)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If the request succeeds, the UPN exists. Log and try again.
      console.log(`userPrincipalName ${userPrincipalName} already exists. Trying another.`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // UPN does not exist, it's unique
        return userPrincipalName;
      } else {
        // Some other error occurred
        console.error(`Error checking userPrincipalName: ${error.message}`);
        throw new Error(`Error checking userPrincipalName: ${error.message}`);
      }
    }
  }

  throw new Error("Unable to generate a unique userPrincipalName after multiple attempts.");
};

// exports.approveTeacherApplication = async (req, res) => {
//   try {
//     const { applicationId } = req.params;

//     // Find the application
//     const application = await TeacherApplication.findById(applicationId).populate("teacher_id");
//     if (!application) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     // Update application status
//     application.approval_status = "approved";
//     application.date_approved = new Date();
//     await application.save();

//     // Update user role to 'teacher'
//     const user = await User.findById(application.teacher_id._id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     user.role = "teacher";
//     await user.save();

//     // Check if a Teacher document already exists for this user
//     const existingTeacher = await Teacher.findOne({ user_id: user._id });
//     if (existingTeacher) {
//       return res.status(400).json({ error: "Teacher profile already exists for this user" });
//     }

//     const token = await getAccessToken();

//     // Sanitize the user's name
//     const sanitizedUserName = sanitizeUserName(user.name);

//     if (!sanitizedUserName) {
//       return res.status(400).json({ error: "Invalid user name for creating Microsoft account" });
//     }

//     const domain = "roycareersolutions.com";
//     const userPrincipalName = await generateUniqueUserPrincipalName(sanitizedUserName, domain, token);

//     const mailNickname = sanitizedUserName; // Use the sanitized name as mailNickname

//     const password = "securePassword123#@!"; // Ensure this meets password policy requirements

//     const teamsUserData = {
//       accountEnabled: true,
//       displayName: user.name, // Full name of the user
//       mailNickname: mailNickname, // Sanitized nickname without spaces or special characters
//       userPrincipalName: userPrincipalName, // Unique UPN
//       passwordProfile: {
//         forceChangePasswordNextSignIn: true,
//         password: password, // Ensure this meets password policy requirements
//       },
//     };

//     const teamsResponse = await axios.post(
//       "https://graph.microsoft.com/v1.0/users",
//       teamsUserData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Create a new Teacher document with Microsoft credentials
//     const teacher = new Teacher({
//       auth_id: user.auth_id,
//       teacher_id: application._id,
//       user_id: user._id,
//       role: "teacher",
//       qualifications: application.qualifications,
//       dateOfBirth: application.dateOfBirth,
//       bio: "",
//       approval_status: "approved",
//       resume_link: application.resume_link,
//       profile_image: application.profileImage,
//       payout_info: "",
//       subject: application.subject_id,
//       class_id: application.class_id,
//       board_id: application.board_id,
//       last_online: new Date(),
//       experience: application.experience,
//       no_of_classes: 0,
//       available_time: "",
//       language: application.language,
//       phone_number: application.phoneNumber,
//       is_grammar_teacher: false,
//       microsoft_id: teamsResponse.data.id,
//       microsoft_password: password,
//       microsoft_principle_name: userPrincipalName,
//     });

//     await teacher.save();

//     // Send email to the teacher
//     if (teamsResponse.data) {
//       const mailOptions = {
//         from: 'Info@gully2global.com',
//         to: user.email, // Send email to the teacher's email address
//         subject: 'Teacher Application Approved',
//         text: `Dear ${user.name},

// Your teacher application has been approved. You are now a registered teacher in our LMS.

// Your Microsoft ID: ${teamsResponse.data.id}
// Your password: ${password}
// Your Microsoft Principal Name: ${userPrincipalName}

// Regards,
// LMS`,
//       };

//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.log("Error sending email: ", error);
//         } else {
//           console.log("Email sent: " + info.response);
//         }
//       });
//     }

//     res.status(200).json({
//       message:
//         "Application approved, teacher profile created, and Teams user created successfully",
//       application,
//       teacher,
//       teamsUser: teamsResponse.data,
//     });
//   } catch (error) {
//     console.error("Error approving teacher application:", error.response ? error.response.data : error.message);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.approveTeacherApplication = async (req, res) => {
//   try {
//     const { applicationId } = req.params;

//     // Find the application
//     const application = await TeacherApplication.findById(
//       applicationId
//     ).populate("teacher_id");
//     if (!application) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     // Update application status
//     application.approval_status = "approved";
//     application.date_approved = new Date();
//     await application.save();

//     // Update user role to 'teacher'
//     const user = await User.findById(application.teacher_id._id);
//     user.role = "teacher";
//     await user.save();

//     // Check if a Teacher document already exists for this user
//     const existingTeacher = await Teacher.findOne({ user_id: user._id });
//     if (existingTeacher) {
//       return res
//         .status(400)
//         .json({ error: "Teacher profile already exists for this user" });
//     }

//     const token = await getAccessToken();

//     // Create a new Teacher document
//     const teacher = new Teacher({
//       auth_id: user.auth_id,
//       teacher_id: application._id,
//       user_id: user._id,
//       role: "teacher",
//       qualifications: application.qualifications,
//       dateOfBirth: application.dateOfBirth,
//       bio: "",
//       approval_status: "approved",
//       resume_link: application.resume_link,
//       profile_image: application.profileImage,
//       payout_info: "",
//       subject: application.subject_id,
//       class_id: application.class_id,
//       board_id: application.board_id,
//       last_online: new Date(),
//       experience: application.experience,
//       no_of_classes: 0,
//       available_time: "",
//       language: application.language,
//       phone_number: application.phoneNumber,
//       is_grammar_teacher: false,
//     });

//     await teacher.save();

//     // Sanitize the user's name to create a valid mailNickname and userPrincipalName
// const sanitizedUserName = user.name.replace(/[^a-zA-Z0-9]/g, ''); // Remove all non-alphanumeric characters

// const userPrincipalName = `${sanitizedUserName}@roycareersolutions.com`.toLowerCase();

//     // Generate Microsoft user credentials

//     // Update teacher document with Microsoft Teams credentials

//     const password = "securePassword123#@!"; // Generate a secure password or use a custom logic
//     // const userPrincipalName = `${user.name}` + `@roycareersolutions.com`; // Replace domain with your tenant domain

//     // const teamsUserData = {
//     //   accountEnabled: true,
//     //   displayName: user.name, // Full name of the user
//     //   mailNickname: user.name, // Nickname without spaces or special characters
//     //   userPrincipalName: userPrincipalName, // Must be a valid email format
//     //   passwordProfile: {
//     //     forceChangePasswordNextSignIn: true,
//     //     password: password, // Ensure this meets password policy requirements
//     //   },
//     // };
//     const teamsUserData = {
//       accountEnabled: true,
//       displayName: user.name, // Full name of the user (can include spaces)
//       mailNickname: sanitizedUserName, // Sanitized nickname without spaces or special characters
//       userPrincipalName: userPrincipalName, // Valid email format without spaces
//       passwordProfile: {
//         forceChangePasswordNextSignIn: true,
//         password: password, // Ensure this meets password policy requirements
//       },
//     };

//     const teamsResponse = await axios.post(
//       "https://graph.microsoft.com/v1.0/users",
//       teamsUserData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     teacher.microsoft_id = teamsResponse.data.id;
//     teacher.microsoft_password = password; // Save the password used to create the user
//     teacher.microsoft_principle_name = userPrincipalName;

//     if (teamsResponse.data) {
//       const mailOptions = {
//         from: 'Info@gully2global.com',
//         to: user.email, // Send email to the teacher's email address
//         subject: 'Teacher Application Approved',
//         text: `Dear ${user.name},\n\nYour teacher application has been approved. You are now a registered teacher in our LMS.\n\n your Microsoft Id is : ${teamsResponse.data.id}\nyour password is : ${password}\n your Microsoft Principal Name is : ${userPrincipalName}\n\nRegards,\nLMS`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//           console.log("Error sending email: ", error);
//       } else {
//           console.log("Email sent: " + info.response);
//       }
//   });
//     }


//     await teacher.save();

//     res.status(200).json({
//       message:
//         "Application approved, teacher profile created, and Teams user created successfully",
//       application,
//       teacher,
//       teamsUser: teamsResponse.data,
//     });
//   } catch (error) {
//     console.error("Error approving teacher application:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// Get a single teacher application by ID
exports.getTeacherApplicationById = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from the request parameters
    // Find the teacher application by ID and populate the teacher details
    const application = await TeacherApplication.findById(id).populate(
      "teacher_id"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Teacher application fetched successfully",
      application,
    });
  } catch (error) {
    console.error("Error fetching teacher application:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTeacherApplicationByUserId = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from the request parameters
    // Find the teacher application by ID and populate the teacher details
    const application = await TeacherApplication.findOne({
      teacher_id: id,
    }).populate("teacher_id");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Teacher application fetched successfully",
      application,
    });
  } catch (error) {
    console.error("Error fetching teacher application:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.approveTeacherApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const {auth_id, user_id,microsoft_id, microsoft_password, microsoft_principle_name } = req.body;

    // Find the application
    const application = await TeacherApplication.findById(applicationId).populate("teacher_id");
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Update application status
    application.approval_status = "approved";
    application.date_approved = new Date();
    await application.save();

    // // Update user role to 'teacher'
    // const user = await User.findById(application.teacher_id._id);
    // if (!user) {
    //   return res.status(404).json({ error: "User not found" });
    // }
    // user.role = "teacher";
    // await user.save();

    // Check if a Teacher document already exists for this user
    const existingTeacher = await Teacher.findOne({ teacher_id:applicationId});
    if (existingTeacher) {
      return res.status(400).json({ error: "Teacher profile already exists for this user" });
    }

  

    // Create a new Teacher document with Microsoft credentials
    const teacher = new Teacher({
      auth_id:auth_id,
      teacher_id: application._id,
      user_id: user_id,
      role: "teacher",
      qualifications: application.qualifications,
      dateOfBirth: application.dateOfBirth,
      bio: "",
      approval_status: "approved",
      resume_link: application.resume_link,
      profile_image: application.profileImage,
      payout_info: "",
      subject: application.subject_id,
      class_id: application.class_id,
      board_id: application.board_id,
      last_online: new Date(),
      experience: application.experience,
      no_of_classes: 0,
      available_time: "",
      language: application.language,
      phone_number: application.phoneNumber,
      is_grammar_teacher: false,
      microsoft_id: microsoft_id,
      microsoft_password: microsoft_password,
      microsoft_principle_name: microsoft_principle_name,
    });

    await teacher.save();


    res.status(200).json({
      message:
        "Application approved, teacher profile created, and Teams user created successfully",
      application,
      teacher,
    });
  } catch (error) {
    console.error("Error approving teacher application:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Server error" });
  }
};