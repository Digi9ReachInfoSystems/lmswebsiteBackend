// src/jobs/batchExpiryJob.js

const cron = require("node-cron");
const mongoose = require("mongoose");
const Student = require("../models/studentModel");

// Example: Daily at midnight
// * Adjust schedule as desired: e.g., "0 0 * * *" => daily at 00:00
const scheduleBatchExpiryJob = async () => {
    //     const schedule= async () => {

    // //     }
    // cron.schedule("0 0 * * *", async () => {
    //     console.log("Running batch expiry check job...");

        try {
            // Get today's date truncated to midnight (optional: you may want exact Date() instead)
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            // Fetch all students
            const students = await Student.find().select("subject_id");

            let totalUpdated = 0;

            // Iterate each student
            for (const student of students) {
                let updated = false;

                // Iterate each subdocument in subject_id array
                student.subject_id.forEach((sub) => {
                    // Only expire if there's a valid date, it's past 'now', 
                    // and the status is currently "active".
                    if (
                        sub.batch_expiry_date &&
                        sub.batch_expiry_date < now &&
                        sub.batch_status === "active"
                    ) {
                        sub.batch_status = "expired";
                        updated = true;
                    }
                });

                // If we changed at least one subdoc, save
                if (updated) {
                    await student.save();
                    totalUpdated++;
                }
            }

            console.log(
                `Batch expiry job completed. ${totalUpdated} student record(s) updated.`
            );
        } catch (error) {
            console.error("Error updating batch expirations:", error);
        }
    }

    // );
    // schedule();
// };

module.exports = scheduleBatchExpiryJob;
