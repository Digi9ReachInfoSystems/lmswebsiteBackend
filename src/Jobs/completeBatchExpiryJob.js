const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const Batch = require("../models/batchModel");
const Student = require("../models/studentModel");
const Subject = require("../models/subjectModel");
const TypeOfBatch = require("../models/typeOfBatchModel");
const User = require("../models/userModel");

const sendEmail = async (emailContent,toMail) => {
    const transporterAdmin = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        port: 465,
        secure: true,
        auth: {
            user: "info@thetopperacademy.com",
            pass: "Mousumeeray1!",
        },
    });

    const mailOptions = {
        from: "info@thetopperacademy.com",
        to: toMail, // Replace with the recipient's email
        subject: "Batch Expiry Notification",
        html: emailContent,
    };

    await transporterAdmin.sendMail(mailOptions);
};

const manageExpiredBatches = async () => {


    try {
        const today = new Date();

        // Find expired batches
        const expiredBatches = await Batch.find({
            date: { $lte: today }, // Expired batches
        }).populate(["subject_id", "type_of_batch", "students"]);
        console.log("Expired Batches:", expiredBatches);
        for (const batch of expiredBatches) {
            const subject = await Subject.findById(batch.subject_id);
            const typeOfBatch = await TypeOfBatch.findById(batch.type_of_batch);

            // Prepare email content
            let emailContent = `
          <h3>Batch Expiry Notification</h3>
          <p>The following batch has expired:</p>
          <ul>
            <li><strong>Batch Name:</strong> ${batch.batch_name}</li>
            <li><strong>Subject:</strong> ${subject?.subject_name || "N/A"}</li>
            <li><strong>Type of Batch:</strong> ${typeOfBatch?.title || "N/A"}</li>
          </ul>
          <p>Student Details with Remaining Days for the Subject:</p>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>contact Number</th>
                <th>email</th>
                <th>Subject</th>
                <th>Remaining Days</th>
                <th>Remaining Months</th>
                <th>Remaining Years</th>
              </tr>
            </thead>
            <tbody>
        `;

            for (const studentId of batch.students) {
                const student = await Student.findById(studentId).populate("user_id");

                // Process `subject_id` array
                const updatedSubjectArray = [];
                for (const subj of student.subject_id) {
                    if (subj?.batch_id?.equals(batch?._id)) {
                        // Calculate remaining days
                        const remainingDays = Math.ceil(
                            (new Date(subj.batch_expiry_date) - today) / (1000 * 60 * 60 * 24)
                        );
                        const remainingMonths = Math.floor(remainingDays / 30);
                        const remainingYears = Math.floor(remainingMonths / 12);

                        // Add student details to email
                        emailContent += `
                <tr>
                  <td>${student?.user_id?.name || "Unknown"}</td>
                  <td>${student?.phone_number || "N/A"}</td>
                  <td>${student?.user_id?.email || "N/A"}</td>
                  <td>${subject?.subject_name || "N/A"}</td>
                  <td>${remainingDays < 0 ? 0 : remainingDays} days</td>
                  <td>${remainingMonths < 0 ? 0 : remainingMonths} months</td>
                  <td>${remainingYears < 0 ? 0 : remainingYears} years</td>
                </tr>
              `;
                    } else {
                        updatedSubjectArray.push(subj); // Keep other subjects
                    }
                }



                // Update student's `subject_id` array
                student.subject_id = updatedSubjectArray;

                // If `subject_id` is empty, clear other arrays
                if (updatedSubjectArray.length === 0) {
                    student.batch_creation = [];
                    student.attendance = [];
                    student.schedule = [];
                    student.worked_hours = 0;
                    student.is_paid = false;
                    student.custom_package_status = "no_package";
                    student.custom_package_id = [];
                } else {
                    // Process `batch_creation` array
                    student.batch_creation = student.batch_creation.filter(
                        (bc) => !bc.subject_id.equals(subject._id)
                    );
                }
                console.log("student", student);
                // Save student changes
                  await student.save();
            }

            emailContent += `
            </tbody>
          </table>
        `;

         const users = await User.find({ role: "admin" });
         users.map(async (user) => {

            // Send email
            await sendEmail(emailContent,user.email);
         });
            // Delete expired batch
            await Batch.findByIdAndDelete(batch._id);
            console.log(`Batch "${batch.batch_name}" deleted successfully.`);
        }
    } catch (err) {
        console.error("Error managing expired batches:", err);
    }
    // );
};


// const schedulePackageExpiryJob = () => {
//     // Schedule the task to run daily at midnight (00:00)
//     console.log("Starting package expiry job...");
//     cron.schedule("30 15 * * *", () => {
//         console.log("Running scheduled package expiry job...");
//         manageExpiredBatches();
//     },
//         {
//             timezone: "Asia/Kolkata" // Set your desired timezone
//         }
//     );
//     // checkAndUpdateExpiredPackages();
//     console.log("Package expiry job scheduled to run daily at midnight.");
// };

module.exports = manageExpiredBatches;

