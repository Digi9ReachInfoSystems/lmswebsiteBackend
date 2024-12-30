const connectDB = require("../config/database");
const manageExpiredBatches = require("../Jobs/completeBatchExpiryJob.js");
const scheduleBatchExpiryJob = require("../Jobs/batchExpiryJob.js");

const mongoose = require("mongoose");

exports.cron = async () => {

    try {

        connectDB();
        await scheduleBatchExpiryJob();
        await manageExpiredBatches();
        console.log("Batch expiry job executed successfully.");
        // process.exit(1); // Exit after completion
    } catch (error) {
        console.error("Error during batch expiry job:", error);
        // process.exit(0); // Exit with error
    }

};