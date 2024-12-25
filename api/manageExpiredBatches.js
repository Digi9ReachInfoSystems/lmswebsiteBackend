const { manageExpiredBatches } = require("../src/Jobs/completeBatchExpiryJob");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    await manageExpiredBatches();
    res.status(200).json({ message: "Batch expiry management job executed." });
  } catch (error) {
    console.error("Error in manageExpiredBatches API:", error);
    res.status(500).json({ message: "Failed to execute batch expiry job." });
  }
};