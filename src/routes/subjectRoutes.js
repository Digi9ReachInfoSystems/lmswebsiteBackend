const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

router.post(
  "/",
  authMiddleware,
  authorizeRole("admin"),
  subjectController.createSubject
);

router.get(
  "/",
  authMiddleware,

  subjectController.getallSubjects
);

router.put(
  "/:subject_id",
  authMiddleware,
  authorizeRole("admin"),
  subjectController.updateSubjects
);

router.delete(
  "/:subject_id",
  authMiddleware,
  authorizeRole("admin"),
  subjectController.deleteSubject
);

module.exports = router;