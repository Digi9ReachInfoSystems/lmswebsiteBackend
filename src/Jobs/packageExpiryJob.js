// src/jobs/packageExpiryJob.js

const cron = require("node-cron");
const mongoose = require("mongoose");
const Student = require("../models/studentModel");
const Batch = require("../models/batchModel");

/**
 * Function to check for expired standard packages and update student records.
 */
const handleStandardPackageExpiry = async () => {
  try {
    console.log("Checking for expired standard packages...");

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    // Find students with expired standard packages
    const expiredStandardStudents = await Student.find({
      package_expiry: { $lt: today },
      is_paid: true,
      subscribed_Package: { $ne: null },
    });

    if (expiredStandardStudents.length === 0) {
      console.log("No expired standard packages found.");
    } else {
      console.log(`Found ${expiredStandardStudents.length} student(s) with expired standard packages.`);

      // Iterate over each expired student
      for (const student of expiredStandardStudents) {

        // Mark all standard packages as inactive
        if (Array.isArray(student.subscribed_Package)) {
          student.subscribed_Package.forEach(pkg => {
            pkg.is_active = false;
          });
        }

        // Update student fields
        student.is_paid = false;
        // student.subscribed_Package = null;
        student.package_expiry = null;
        student.batch_creation = null; // Or [] if you prefer an empty array
        // student.attendance = null; // Or [] if you prefer an empty array

        await student.save();

        // Remove student from all batches they are part of
        await Batch.updateMany(
          { students: student._id },
          { $pull: { students: student._id } }
        );

        console.log(`Updated and removed student ${student._id} from batches.`);
      }
    }
  } catch (error) {
    console.error("Error handling standard package expiries:", error);
  }
};

/**
 * Function to check for expired custom packages and update student records.
 */
const handleCustomPackageExpiry = async () => {
  try {
    console.log("Checking for expired custom packages...");

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    // Find students with expired custom packages
    const expiredCustomStudents = await Student.find({
      custom_package_expiry: { $lt: today },
      custom_package_id: { $ne: null },
      custom_package_status: "approved",
    });

    if (expiredCustomStudents.length === 0) {
      console.log("No expired custom packages found.");
    } else {
      console.log(`Found ${expiredCustomStudents.length} student(s) with expired custom packages.`);

      // Iterate over each expired student
      for (const student of expiredCustomStudents) {

        // Mark all custom packages as inactive
        if (Array.isArray(student.custom_package_id)) {
          student.custom_package_id.forEach(cp => {
            cp.is_active = false;
          });
        }

        // Update student fields
        // student.custom_package_id = null;
        student.custom_package_status = "expired";
        student.custom_package_expiry = null;
        // student.attendance = null; // Or [] if you prefer an empty array
        // student.schedule = null; // Or [] if you prefer an empty array
        student.batch_creation = null; // Or [] if you prefer an empty array

        await student.save();

        // Remove student from all batches they are part of
        await Batch.updateMany(
          { students: student._id },
          { $pull: { students: student._id } }
        );

        console.log(`Updated and removed student ${student._id} from batches.`);
      }
    }
  } catch (error) {
    console.error("Error handling custom package expiries:", error);
  }
};

/**
 * Main function to run all expiry handlers.
 */
const checkAndUpdateExpiredPackages = async () => {
  await handleStandardPackageExpiry();
  await handleCustomPackageExpiry();
};

/**
 * Function to schedule the package expiry job.
 */
const schedulePackageExpiryJob = () => {
  // Schedule the task to run daily at midnight (00:00)
  console.log("Starting package expiry job...");
  // cron.schedule("0 0 * * *", () => {
  //   console.log("Running scheduled package expiry job...");
  //   checkAndUpdateExpiredPackages();
  // });
  checkAndUpdateExpiredPackages();
  console.log("Package expiry job scheduled to run daily at midnight.");
};

module.exports = schedulePackageExpiryJob;
