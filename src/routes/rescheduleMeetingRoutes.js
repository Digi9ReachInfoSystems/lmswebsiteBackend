// routes/rescheduleMeetingRoutes.js

const express = require("express");
const router = express.Router();
const rescheduleMeetingController = require("../controllers/rescheduleMeetingController");


// Route to create a reschedule meeting (Protected Route)
router.post(
  "/reschedule-meetings/create",
  rescheduleMeetingController.createRescheduleMeeting
);

// Route to get reschedule meetings by teacher ID (Protected Route)
router.get(
  "/reschedule-meetings/teacher/:teacherId",
  rescheduleMeetingController.getRescheduleMeetingsByTeacherId
);

router.put(
  "/reschedule-meetings/approve/:meetingId",
  rescheduleMeetingController.updateRescheduleMeetingStatus
)
router.put(
  "/reschedule-meetings/reject/:meetingId",
  rescheduleMeetingController.rejectRescheduleMeeting
)

module.exports = router;