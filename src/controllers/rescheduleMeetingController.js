// controllers/rescheduleMeetingController.js

const mongoose = require("mongoose");
const RescheduleMeeting = require("../models/rescheduleMeetingModel");
const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");
const Batch = require("../models/batchModel"); // Ensure Batch model is imported
const Meeting = require("../models/meetingModel");

/**
 * Controller to create a new reschedule meeting request.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createRescheduleMeeting = async (req, res) => {
    try {
        const {
            student_id,
            teacher_id,
            start,
            end,
            batch_id,
            meeting_id,
            meeting_title,
            meeting_description,
        } = req.body;
        // Validate required fields
        if (!student_id || !teacher_id || !start || !end || !batch_id || !meeting_title) {
            return res.status(400).json({ error: "All required fields must be provided." });
        }

        // Validate ObjectIds
        if (
            !mongoose.Types.ObjectId.isValid(student_id) ||
            !mongoose.Types.ObjectId.isValid(teacher_id) ||
            !mongoose.Types.ObjectId.isValid(batch_id)
        ) {
            return res.status(400).json({ error: "Invalid ID format for student, teacher, or batch." });
        }

        // Validate start and end dates
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format for start or end." });
        }

        if (endDate <= startDate) {
            return res.status(400).json({ error: "End date must be after start date." });
        }

        // Check if referenced documents exist
        const [student, teacher, batch, meeting] = await Promise.all([
            Student.findById(student_id),
            Teacher.findById(teacher_id),
            Batch.findById(batch_id),
            Meeting.findById(meeting_id),
        ]);

        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }

        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found." });
        }

        if (!batch) {
            return res.status(404).json({ error: "Batch not found." });
        }

        // Optional: Check for overlapping reschedule requests
        const overlappingMeeting = await RescheduleMeeting.findOne({
            teacher_id,
            status: { $in: ["pending", "approved"] },
            $or: [
                { start: { $lte: endDate }, end: { $gte: startDate } },
            ],
        });

        if (overlappingMeeting) {
            return res.status(400).json({ error: "There is an overlapping reschedule request for this teacher." });
        }

        // Create new reschedule meeting
        const newRescheduleMeeting = new RescheduleMeeting({
            student_id,
            teacher_id,
            start: startDate,
            end: endDate,
            batch_id,
            meeting_id,
            meeting_title,
            meeting_description,
        });

        await newRescheduleMeeting.save();

        return res.status(201).json({
            message: "Reschedule meeting request created successfully.",
            rescheduleMeeting: newRescheduleMeeting,
        });
    } catch (error) {
        console.error("Error creating reschedule meeting:", error);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

/**
 * Controller to get reschedule meetings by teacher ID.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRescheduleMeetingsByTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.params;

        // Validate teacherId
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return res.status(400).json({ error: "Invalid teacher ID format." });
        }

        // Check if teacher exists
        const teacherExists = await Teacher.findById(teacherId);
        if (!teacherExists) {
            return res.status(404).json({ error: "Teacher not found." });
        }

        // Fetch reschedule meetings for the teacher
        const rescheduleMeetings = await RescheduleMeeting.find({ teacher_id: teacherId, status: "pending" })
            .populate({
                path: "teacher_id",
                populate: { path: "user_id", select: "name email" },
            })
            .populate({
                path: "student_id",
                populate: { path: "user_id", select: "name email" },
            })
            .populate("batch_id", "batch_name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            rescheduleMeetings,
        });
    } catch (error) {
        console.error("Error fetching reschedule meetings by teacher ID:", error);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};


/**
 * Controller to update the status of a reschedule meeting request.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateRescheduleMeetingStatus = async (req, res) => {
    try {
        const meetingId = new mongoose.Types.ObjectId(req.params.meetingId);

        if (!mongoose.Types.ObjectId.isValid(meetingId)) {
            return res.status(400).json({ error: "Invalid meeting ID format." });
        }

        const rescheduleMeeting = await RescheduleMeeting.findOne({ meeting_id: meetingId });
        if (!rescheduleMeeting) {
            return res.status(404).json({ error: "Reschedule meeting not found for the provided meeting ID." });
        }

        rescheduleMeeting.status = "approved";
        await rescheduleMeeting.save();

        const { student_id, teacher_id } = rescheduleMeeting;

        const studentUpdateResult = await Student.updateOne(
            { _id: student_id, "schedule.meeting_id": meetingId },
            { $set: { "schedule.$.meeting_reschedule": true } }
        );

        if (studentUpdateResult.modifiedCount === 0) {
            console.warn(`Meeting ID ${meetingId} not found in Student schedule.`);
            // Optionally, handle this scenario, e.g., notify the user
        }

        const teacherUpdateResult = await Teacher.updateOne(
            { _id: teacher_id, "schedule.meeting_id": meetingId },
            { $set: { "schedule.$.meeting_reschedule": true } }
        );

        console.log(teacherUpdateResult);

        if (teacherUpdateResult.modifiedCount === 0) {
            console.warn(`Meeting ID ${meetingId} not found in Teacher schedule.`);
            // Optionally, handle this scenario
        }

        return res.status(200).json({
            message: "Reschedule meeting status updated successfully.",
            rescheduleMeeting,
        });

    } catch (error) {
        console.error("Error updating reschedule meeting status:", error);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};


/**
 * Controller to update the status of a reschedule meeting request.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.rejectRescheduleMeeting = async (req, res) => {
    try {

        const meetingId = new mongoose.Types.ObjectId(req.params.meetingId);
        // 1. Validate meetingId
        if (!mongoose.Types.ObjectId.isValid(meetingId)) {
            return res.status(400).json({ error: "Invalid meeting ID format." });
        }

        const rescheduleMeeting = await RescheduleMeeting.findOne({ meeting_id: meetingId });
        if (!rescheduleMeeting) {
            return res.status(404).json({ error: "Reschedule meeting not found for the provided meeting ID." });
        }

        rescheduleMeeting.status = "rejected";
        await rescheduleMeeting.save();

        return res.status(200).json({
            message: "Reschedule meeting rejected successfully.",
            rescheduleMeeting,
        });

    } catch (error) {
        console.error("Error updating reschedule meeting status:", error);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};
