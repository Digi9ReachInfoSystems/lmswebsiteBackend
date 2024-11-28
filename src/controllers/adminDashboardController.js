const mongoose = require("mongoose");
const  Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const Payment = require("../models/paymentModel");
const Batch= require("../models/batchModel");
const TeacherApplication= require("../models/teacherApplicationModel");
const moment = require("moment");  // For date manipulation



exports.getNumberOfStudents = async (req, res) => {
    try {
        const count = await Student.countDocuments();
        res.json({message: "Number of students", count:count});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getNumberOfTeachers = async (req, res) => {
    try {
        const count = await Teacher.countDocuments();
        res.json({message: "Number of teachers", count:count});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getToatalPayment = async (req, res) => {
    try {
        // Using aggregation to sum the 'amount' field where 'status' is 'paid'
        const result = await Payment.aggregate([
          { $match: { status: "paid" } },  // Match payments with 'paid' status
          { $group: { _id: null, totalAmount: { $sum: "$amount" } } },  // Sum the amounts
        ]);
    
        // If no results, set totalAmount to 0
        const totalAmount = result.length > 0 ? result[0].totalAmount : 0;
    
        res.status(200).json({
          success: true,
          totalAmount: totalAmount,  // Return the total paid amount
        });
      } catch (error) {
        console.error("Error calculating total paid amount:", error);
        res.status(500).json({
          success: false,
          message: "Server error. Unable to fetch total paid amount.",
        });
      }
    };

// Controller function to get total paid and unpaid amounts
exports.getPaidAndUnpaidAmount = async (req, res) => {
    try {
      // Using aggregation to calculate both the paid and unpaid amounts
      const result = await Payment.aggregate([
        {
          $group: {
            _id: "$status",  // Group by 'status'
            totalAmount: { $sum: "$amount" }  // Sum the 'amount' field
          }
        },
        {
          $project: {  // Project the result to only include the required fields
            status: "$_id",  // Renaming _id to 'status'
            totalAmount: 1,  // Including totalAmount field
            _id: 0  // Exclude the _id field
          }
        }
      ]);
  
      // Initialize total amounts for paid and unpaid
      let paidAmount = 0;
      let unpaidAmount = 0;
  
      // Loop through the result to find paid and unpaid amounts
      result.forEach((entry) => {
        if (entry.status === "paid") {
          paidAmount = entry.totalAmount;
        } else if (entry.status === "created" || entry.status === "failed" || entry.status === "refunded") {
          unpaidAmount = entry.totalAmount;
        }
      });
  
      // Return the result
      res.status(200).json({
        success: true,
        paid_amount: paidAmount,
        unpaid_amount: unpaidAmount
      });
  
    } catch (error) {
      console.error("Error calculating paid and unpaid amounts:", error);
      res.status(500).json({
        success: false,
        message: "Server error. Unable to fetch paid and unpaid amounts."
      });
    }
  };

  exports.getNumberOfBatches = async (req, res) => {
    try {
        const count = await Batch.countDocuments();
        res.json({message: "Number of batches", count:count});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
  };

  
// Controller function to get the number of applications submitted each day for the last 7 days
exports.getApplicationsForLast7Days = async (req, res) => {
    try {
      // Get the current date and the date 7 days ago
      const today = moment().startOf("day");
      const sevenDaysAgo = moment().subtract(7, "days").startOf("day");
  
      // Aggregation pipeline to count applications per day for the last 7 days
      const result = await TeacherApplication.aggregate([
        {
          $match: { 
            date_applied: { 
              $gte: sevenDaysAgo.toDate(), 
              $lt: today.toDate() 
            } 
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date_applied" } },  // Group by date (YYYY-MM-DD)
            count: { $sum: 1 }  // Count the number of applications per day
          }
        },
        {
          $sort: { _id: 1 }  // Sort by date (ascending)
        }
      ]);
  
      // Format the result to include missing days in the last 7 days
      const allDates = [];
      for (let i = 6; i >= 0; i--) {
        allDates.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
      }
  
      const formattedResult = allDates.map((date) => {
        const found = result.find((item) => item._id === date);
        return { date, applications: found ? found.count : 0 };
      });
  
      // Return the formatted result
      res.status(200).json({
        success: true,
        data: formattedResult
      });
      
    } catch (error) {
      console.error("Error fetching applications for last 7 days:", error);
      res.status(500).json({
        success: false,
        message: "Server error. Unable to fetch application data."
      });
    }
  };


// Controller function to get the daily revenue for a specific month and year
exports.getDailyRevenueForMonth = async (req, res) => {
    try {
      const { year, month } = req.query; // Get year and month from params
  
      // Validate input
      if (!year || !month) {
        return res.status(400).json({ success: false, message: "Year and month are required." });
      }
  
      // Ensure year and month are valid
      if (!moment(`${year}-${month}`, "YYYY-MM").isValid()) {
        return res.status(400).json({ success: false, message: "Invalid year or month." });
      }
  
      // Start and end dates for the given month
      const startOfMonth = moment(`${year}-${month}`, "YYYY-MM").startOf('month').toDate();
      const endOfMonth = moment(`${year}-${month}`, "YYYY-MM").endOf('month').toDate();
  
      // Aggregation pipeline to calculate daily revenue for the specified month
      const result = await Payment.aggregate([
        {
          $match: {
            status: "paid", // Only consider paid payments
            createdAt: {
              $gte: startOfMonth, // Filter by the start of the month
              $lte: endOfMonth,   // Filter by the end of the month
            }
          }
        },
        {
          $group: {
            _id: { $dayOfMonth: "$createdAt" }, // Group by day of the month
            totalAmount: { $sum: "$amount" }    // Sum amounts for each day
          }
        },
        {
          $sort: { _id: 1 }  // Sort by day of the month (ascending)
        }
      ]);
  
      // Format the result to include missing days with zero revenue
      const allDaysInMonth = Array.from({ length: moment(`${year}-${month}`, "YYYY-MM").daysInMonth() }, (_, i) => i + 1);
  
      const formattedResult = allDaysInMonth.map(day => {
        const found = result.find(item => item._id === day);
        return { day, revenue: found ? found.totalAmount : 0 };
      });
  
      // Return the formatted result
      res.status(200).json({
        success: true,
        data: formattedResult
      });
  
    } catch (error) {
      console.error("Error fetching daily revenue:", error);
      res.status(500).json({
        success: false,
        message: "Server error. Unable to fetch daily revenue."
      });
    }
  };
  
  
  
  