// const express = require("express");
// const router = express.Router();
// const meetingController = require("../controllers/meetingController");
// const authMiddleware = require("../middlewares/authMiddleware");
// const authorizeRole = require("../middlewares/authorizeRole");

// router.get(
//   "/getMeetings",
//   authMiddleware,
//   authorizeRole("admin"),
//   meetingController.getMeetings
// );

// router.get(
//   "/getMeetingById/:meetingId",
//   authMiddleware,
//   authorizeRole("teacher"),
//   meetingController.getMeetingsForTeacher
// );

// router.get(
//   "/getMeetingByIdForStudent/:meetingId",
//   authMiddleware,
//   authorizeRole("student"),
//   meetingController.getMeetingForStudents
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
 
router.get(
  "/getMeetings",
  authMiddleware,
  authorizeRole("admin"),
  meetingController.getMeetings
);
 
router.get(
  "/getMeetingById/:meetingId",
  authMiddleware,
  authorizeRole("teacher"),
  meetingController.getMeetingsForTeacher
);
 
router.post(
  "/createMeeting",
 
  meetingController.createMeetingTeams
);
 
router.get(
  "/getMeetingByIdForStudent/:meetingId",
  authMiddleware,
  authorizeRole("student"),
  meetingController.getMeetingForStudents
);
 
router.post("/joinmeeting", meetingController.getJoinUrl);
 
module.exports = router;
 
