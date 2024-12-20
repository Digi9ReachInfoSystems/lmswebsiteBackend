const express = require("express");
const router = express.Router();
const batchController = require("../controllers/batchController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

router.post(
  "/",
  // authMiddleware,
  // authorizeRole("admin"),
  batchController.createBatch
);
router.get(
  "/getBatches/teacher/:teacherId",
  authMiddleware,
  batchController.getBatchesByTeacherId
);

router.get("/:id",batchController.getBatchById);

router.get("/getAllBatches/student/:studentId", batchController.getBatchesByStudentId);



router.get("/getAllBatchesNoFilter", batchController.getAllBatchesNoFilter);

router.get("/getAllBatches/all", batchController.getAllBatches);

router.post("/addstudents/:batchId", batchController.addStudentsToBatch);
// router.get(
//   "/getBatchForStudent",
//   authorizeRole("student"),
//   authMiddleware,
//   batchController.getBatchForStudent
// );
module.exports = router;
