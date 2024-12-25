const connectDB = require("../config/database");
const manageExpiredBatches = require("../Jobs/completeBatchExpiryJob.js");

const mongoose = require("mongoose");

exports.cron = async () => {

    try {

        connectDB();
        await manageExpiredBatches();
        console.log("Batch expiry job executed successfully.");
        process.exit(0); // Exit after completion
    } catch (error) {
        console.error("Error during batch expiry job:", error);
        process.exit(1); // Exit with error
    }

};