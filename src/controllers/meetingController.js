const Meeting = require("../models/meetingModel");
const express = require("express");
const axios = require("axios"); // Corrected capitalization
const batch = require("../models/batchModel");
const Subject = require("../models/subjectModel");
const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");
const mongoose = require("mongoose");
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

const getAccessToken = async () => {
  const url = `https://login.microsoftonline.com/4a18f542-e76b-4e64-b11b-22cf887e4659/oauth2/v2.0/token`;
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: "4374176d-7f91-4d83-a5e7-c44d06d12726",
    client_secret: "2rY8Q~~uzeAvhdFbCjfI5TLR3T~GLdJWEAQoTdi9",
    scope: "https://graph.microsoft.com/.default",
  });

  const response = await axios.post(url, params);
  return response.data.access_token;
};
/**
 * Creates a recurring meeting on Microsoft Teams and stores the meeting details in MongoDB
 * @param {Object} req.body - Body of the request
 * @param {string} req.body.email - Email of the user creating the meeting
 * @param {string} req.body.startDate - Start date of the meeting in ISO format
 * @param {string} req.body.endDate - End date of the meeting in ISO format
 * @param {string} req.body.recurrencePattern - Recurrence pattern for the meeting
 * @param {string} req.body.teacher_id - Teacher ID of the teacher creating the meeting
 * @param {string} req.body.batch_id - Batch ID of the batch for which the meeting is created
 * @param {Array<string>} req.body.students - Array of student IDs for which the meeting is created
 * @param {string} req.body.title - Title of the meeting
 * @return {Promise<Object>} - Promise resolved with the meeting ID and join URL
 */
exports.createMeetingTeams = async (req, res) => {
  try {
    const {
      email,
      startDate,
      endDate,
      recurrencePattern,
      teacher_id,
      batch_id,
      students,
      title, 
    } = req.body;

    const token = await getAccessToken();

    const meetingDetails = {
      startDateTime: startDate,
      endDateTime: endDate,
      subject: title, 
    };

    const teacher= await Teacher.findById(teacher_id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const graphResponse = await axios.post(
      `https://graph.microsoft.com/v1.0/users/${teacher.microsoft_id}/onlineMeetings`,
      meetingDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { joinWebUrl, id } = graphResponse.data;
    console.log(graphResponse);

    const meetingData = {
      startDate: startDate,
      endDate: endDate,
      teacher_id: teacher_id,
      batch_id: batch_id,
      students: students,
      recurrencePattern: recurrencePattern,
      meeting_link: joinWebUrl, 
      meetingId: id, 
    };

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the duration in minutes
    const meetingDurationMinutes = Math.floor((end - start) / 60000); // Duration in minutes

    // Alternatively, calculate duration in hours
    const meetingDurationHours = (end - start) / 3600000; // Duration in hours

    // Use `meetingDurationMinutes` or `meetingDurationHours` as per your requirement
    const meetingTime = meetingDurationMinutes; // or meetingDurationHours for hours

    // Save meeting details to MongoDB
    const meeting = new Meeting(meetingData);

    await batch.findByIdAndUpdate(batch_id, {
      $set: { meeting_link: joinWebUrl },
    });

    const duration = new Date(endDate) - new Date(startDate); // Duration in milliseconds

    await Teacher.findByIdAndUpdate(
      teacher_id,
      {
        $push: {
          schedule: {
            date: new Date(startDate),
            meeting_url: joinWebUrl,
            meeting_title: title,
            meeting_time: meetingTime,
            meeting_id: meeting._id,
          },
        },
      },
      { new: true }
    );

    await meeting.save();

   students.forEach(async (student) => {
      await Student.findByIdAndUpdate(student,
        {
          $push: {
            schedule: {
              date: new Date(startDate),
              meeting_url: joinWebUrl,
              meeting_title: title,
              meeting_time: meetingTime,
              meeting_id: meeting._id,
              meeting_reschedule: false,
              teacher_id: teacher_id
            },
          },
        },
        { new: true }
      );
    })

    res.status(200).json({
      message: "Meeting created successfully",
      joinUrl: joinWebUrl,
      meetingId: id,
    });
  } catch (error) {
    console.error("Error creating recurring meeting:", error);
    res.status(500).json({ error: "Failed to create recurring meeting" });
  }
};

exports.getJoinUrl = async (req, res) => {
  try {
    const { meetingId } = req.params; // Get the meeting ID from the request
    const token = await getAccessToken();

    const graphResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/me/onlineMeetings/${meetingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { joinUrl } = graphResponse.data;

    res.status(200).json({ joinUrl }); // Return the join URL to the client
  } catch (error) {
    console.error("Error fetching join URL:", error);
    res.status(500).json({ error: "Failed to fetch join URL" });
  }
};

exports.getAttendance = async (req, res) => {};


/**
 * Controller to get the batch ID associated with a specific meeting ID.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getBatchIdByMeetingId = async (req, res) => {
  try {
    const { meetingId } = req.params;

    // 1. Validate the meetingId
    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({ error: "Invalid meeting ID format." });
    }

    // 2. Fetch the meeting document by ID and populate the batch_id
    const meeting = await Meeting.findById(meetingId).populate("batch_id");

    // 3. Check if the meeting exists
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found." });
    }

    // 4. Extract the batch_id (populated with batch details if needed)
    const batchId = meeting.batch_id;

    // Optional: If you want to return detailed batch information, you can modify the response
    // For example:
    /*
    const batchDetails = await Batch.findById(batchId).select("-__v"); // Exclude __v field
    if (!batchDetails) {
      return res.status(404).json({ error: "Batch not found." });
    }
    */

    // 5. Respond with the batch_id
    return res.status(200).json({
      batch_id: batchId._id, // If populated, batchId is an object. Otherwise, it's the ObjectId.
      // Optional: Include batch details
      // batch: batchDetails
    });

  } catch (error) {
    console.error("Error fetching batch ID by meeting ID:", error);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
};

exports.getMeetingRecordings = async (req, res) => {

  try {
    const { meetingId,teacherId } = req.body;

    // 1. Validate the meetingId  
    if (!meetingId||!teacherId) {
      return res.status(400).json({ error: "ImeetingId and teacherId required" });
    }
    const token = await getAccessToken();
    // const token="eyJ0eXAiOiJKV1QiLCJub25jZSI6IktlVW1UOFNiSlZ2TVo4WXY5V1BIUTZBUDVaLVc1WlNCYVF1eG5PZ2o3bzAiLCJhbGciOiJSUzI1NiIsIng1dCI6InoxcnNZSEhKOS04bWdndDRIc1p1OEJLa0JQdyIsImtpZCI6InoxcnNZSEhKOS04bWdndDRIc1p1OEJLa0JQdyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80YTE4ZjU0Mi1lNzZiLTRlNjQtYjExYi0yMmNmODg3ZTQ2NTkvIiwiaWF0IjoxNzM0NjAzMDYzLCJuYmYiOjE3MzQ2MDMwNjMsImV4cCI6MTczNDYwNjk2MywiYWlvIjoiazJCZ1lFaFhMdTdhbjN6Ymg5OUhaWGVJZXQ1ZUFBPT0iLCJhcHBfZGlzcGxheW5hbWUiOiJsbXN3ZWJzaXRlIiwiYXBwaWQiOiI0Mzc0MTc2ZC03ZjkxLTRkODMtYTVlNy1jNDRkMDZkMTI3MjYiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80YTE4ZjU0Mi1lNzZiLTRlNjQtYjExYi0yMmNmODg3ZTQ2NTkvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiI4NjljZDFjOS02NmI5LTQwZWQtYTgxNi1lN2I1ZWVjNTlmYzUiLCJyaCI6IjEuQWNZQVF2VVlTbXZuWkU2eEd5TFBpSDVHV1FNQUFBQUFBQUFBd0FBQUFBQUFBQURHQUFER0FBLiIsInJvbGVzIjpbIlVzZXIuUmVhZEJhc2ljLkFsbCIsIk9ubGluZU1lZXRpbmdzLlJlYWQuQWxsIiwiVXNlci5SZXZva2VTZXNzaW9ucy5BbGwiLCJPbmxpbmVNZWV0aW5ncy5SZWFkV3JpdGUuQWxsIiwiVXNlci5SZWFkV3JpdGUuQWxsIiwiVXNlci5EZWxldGVSZXN0b3JlLkFsbCIsIkFkbWluaXN0cmF0aXZlVW5pdC5SZWFkLkFsbCIsIlVzZXIuRW5hYmxlRGlzYWJsZUFjY291bnQuQWxsIiwiVXNlci5JbnZpdGUuQWxsIiwiVXNlci5SZWFkLkFsbCIsIlVzZXIuRXhwb3J0LkFsbCIsIlVzZXIuTWFuYWdlSWRlbnRpdGllcy5BbGwiLCJBZG1pbmlzdHJhdGl2ZVVuaXQuUmVhZFdyaXRlLkFsbCJdLCJzdWIiOiI4NjljZDFjOS02NmI5LTQwZWQtYTgxNi1lN2I1ZWVjNTlmYzUiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiI0YTE4ZjU0Mi1lNzZiLTRlNjQtYjExYi0yMmNmODg3ZTQ2NTkiLCJ1dGkiOiJlcGRSaDk1Nm9FbXA4Qng1UFJvX0FnIiwidmVyIjoiMS4wIiwid2lkcyI6WyIwOTk3YTFkMC0wZDFkLTRhY2ItYjQwOC1kNWNhNzMxMjFlOTAiXSwieG1zX2lkcmVsIjoiNyAxNCIsInhtc190Y2R0IjoxNzMxMTczMjY4fQ.cX0PlYeF3GTMCVA8fsdEgGKzNz5ai1YBLT9F0h5JqOxrqc4LoNTM4GTZnaJ7GfltCSp-9hAfJ8Hut6n4a5pfFxIbUqELb_dGGCRDhLvVjb8UnsgMvoMfk78LYwdJYeeMHkAUtetW8optaY6kiJCUwxpPKXXsg1pNwc0_00BjgWHgB3S-WkpsOnjspqOutRCbJzuR1P88222L2nKn6V2aOwiMqLYiF0SnOypZlhCNkmA8f4qWHJOiGvGrZpLKtKe8Bq9wJMB1FnT2fZhJrTe4eStkW2CurW9aihjdpKOSVFDBixhfsfkQQibMxt3eH3N-msbAothOGYiGEJBFgn3T9Q"
    const graphResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/users/${teacherId}/onlineMeetings/${meetingId}/recordings/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.status(200).json(graphResponse.data);

    // 2. Fetch the meeting document by ID and populate the batch_id

  }catch (error) {
    console.error("Error fetching batch ID by meeting ID:", error);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }

    
};