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

router.get("/getAllBatchesNoFilter", batchController.getAllBatchesNoFilter);

router.get("/getAllBatches", batchController.getAllBatches);
router.get(
  "/getBatchForStudent",
  authorizeRole("student"),
  authMiddleware,
  batchController.getBatchForStudent
);
module.exports = router;
