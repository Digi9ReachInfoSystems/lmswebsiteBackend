const Meeting = require("../models/meetingModel"); // Corrected capitalization

exports.getMeetings = async (req, res) => {
  try {
    // Extract startDate and endDate from query parameters
    const { startDate, endDate } = req.query;
 
    // Initialize the date filter object
    let dateFilter = {};
 
    if (startDate || endDate) {
      dateFilter.created_at = {};
 
      // If startDate is provided, add $gte (greater than or equal) to dateFilter
      if (startDate) {
        dateFilter.created_at.$gte = new Date(startDate);
      }
 
      // If endDate is provided, add $lte (less than or equal) to dateFilter
      if (endDate) {
        // Set time to the end of the day for endDate
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.created_at.$lte = end;
      }
    }
 
    const meetings = await Meeting.find(dateFilter)
      .populate({
        path: "teacher_id",
        select: "user_id",
        populate: {
          path: "user_id",
          select: "name email",
        },
      })
      .populate({
        path: "batch",
        select: "batch_name",
      })
      .populate({
        path: "subject",
        select: "subject_name",
      })
      .populate({
        path: "students",
        select: "user_id",
        populate: {
          path: "user_id",
          select: "name email",
        },
      });
 
    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Server error" });
  }
};
 
exports.getMeetingsForTeacher = async (req, res) => {
  try {
    const meetings = await Meeting.find({ teacher_id: req.user._id })
      .populate("teacher_id", "name email")
      .populate("batch", "batch_name")
      .populate("subject", "subject_name")
      .populate("students", "user_id")
      .populate("students.user_id", "name email");
    res.status(200).json(meetings);
  } catch {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Server error" });
  }
};
 
exports.getMeetingForStudents = async (req, res) => {
  try {
    const meetings = await Meeting.find({ students: req.user._id })
      .populate("teacher_id", "name email")
      .populate("batch", "batch_name")
      .populate("subject", "subject_name")
      .populate("students", "user_id")
      .populate("students.user_id", "name email");
    res.status(200).json(meetings);
  } catch {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Server error" });
  }
};
