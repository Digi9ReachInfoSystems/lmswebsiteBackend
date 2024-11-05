// src/controllers/customerQueryController.js

const Quer = require("../models/customerQueriesModel");

exports.sendCustomerQuery = async (req, res) => {
  try {
    const { title, contactEmail, contactNumber, message } = req.body;

    // Validate required fields
    if (!title || !contactEmail || !contactNumber || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new customer query
    const Queries = require("../models/customerQueriesModel");
    const newQuery = new Quer({
      title,
      contactEmail,
      contactNumber,
      message,
    });

    await newQuery.save();
    res.status(201).json({
      message: "Query sent successfully",
      query: newQuery,
    });
  } catch (error) {
    console.error("Error sending customer query:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.updateQueryStatus = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { querySolved, attendedBy } = req.body;

    // Find the query by ID
    const query = await Quer.findById(queryId);
    if (!query) {
      return res.status(404).json({ error: "Query not found" });
    }

    // Update the query status
    query.querySolved = querySolved || query.querySolved;
    query.attendedBy = attendedBy || query.attendedBy;
    query.queryStatus = querySolved ? "solved" : "pending";

    await query.save();
    res.status(200).json({
      message: "Query status updated successfully",
      query,
    });
  } catch (error) {
    console.error("Error updating query status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllQueries = async (req, res) => {
  try {
    const { startDate, endDate, queryStatus } = req.query;

    // Create a query object for filtering
    const filter = {};

    // If queryStatus is provided, filter by status (e.g., "pending" or "solved")
    if (queryStatus) {
      filter.queryStatus = queryStatus;
    }

    // If startDate or endDate are provided, filter by dateQueried
    if (startDate || endDate) {
      filter.dateQueried = {};
      if (startDate) {
        filter.dateQueried.$gte = new Date(startDate); // Greater than or equal to startDate
      }
      if (endDate) {
        filter.dateQueried.$lte = new Date(endDate); // Less than or equal to endDate
      }
    }


    const queries = await Quer.find(filter).sort({ dateQueried: -1 });

    res.status(200).json({
      message: "Queries fetched successfully",
      queries,
    });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Controller to get a single query by ID
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Promise<void>}
 */
exports.getQueryById = async (req, res) => {
  try {
    // Get ID from route parameters
    const queryId = req.params.id;
    // Find the query in the database
    const query = await Quer.findById(queryId);

    if (!query) {
      // If the query is not found, return a 404 status with a message
      return res.status(404).json({ message: "Query not found" });
    }

    // Return the query with a 200 status
    res.status(200).json(query);
  } catch (error) {
    console.error("Error fetching query:", error);
    // If there is an error, return a 500 status with a message
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
