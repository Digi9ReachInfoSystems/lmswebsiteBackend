// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const {
    applicationRecievedAdmin,
    applicationRecievedTeacher,
    studentSignedUpAdmin,
    studentAccountCreated,
    teacherApplicationApproved,
    subscriptionDoneAdmin,
    subscriptionDoneStudent,
    customerQuery,
    circularCreatedAdmin,
    BatchCreatedAdmin,
    newQuizCreated,
    newAssignmentCreated,
    newMaterialCreated,
    quizResponseSubmited,
    assignmentSubmited,
    newMeetingCreated,
    customerQueryAdmin,
    newlogin
} = require('../controllers/mailController');


// Create a new notification
router.post('/applicationRecievedAdmin', applicationRecievedAdmin);
router.post('/applicationRecievedTeacher', applicationRecievedTeacher);
router.post('/studentSignedUpAdmin',studentSignedUpAdmin);
router.post('/studentCreated',studentAccountCreated);
router.post('/TeacherCreated',teacherApplicationApproved);
router.post('/studentPaymentReceived',subscriptionDoneAdmin);
router.post('/studentPaymentReceivedStudent',subscriptionDoneStudent);
router.post("/customerQueryRecievedAdmin", customerQueryAdmin);
router.post("/customerQueryRecieved",customerQuery);
router.post("/circular",circularCreatedAdmin);
router.post("/newBatch",BatchCreatedAdmin);
router.post("/newQuiz",newQuizCreated);
router.post("/newAssignment",newAssignmentCreated);
router.post("/newMaterial",newMaterialCreated);
router.post("/quizResponseSubmitted",quizResponseSubmited);
router.post("/assignmentSubmitted",assignmentSubmited);
router.post("/newMeeting", newMeetingCreated);
router.post("/newLogin",newlogin);

module.exports = router;