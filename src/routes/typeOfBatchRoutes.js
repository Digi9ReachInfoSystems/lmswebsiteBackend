// routes/typeOfBatchRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTypeOfBatch,
  getSingleTypeOfBatch,
  getAllTypeOfBatch,
  updateDiscount,
  updateAllFields,
  deleteTypeOfBatch,
} = require("../controllers/typeOfBatchController");

// Create new TypeOfBatch
router.post("/create", createTypeOfBatch);

// Get single TypeOfBatch by ID
router.get("/:id", getSingleTypeOfBatch);

// Get all TypeOfBatch
router.get("/", getAllTypeOfBatch);

// Update discount percentage (and recalculate discounted price)
router.put("/:id/discount", updateDiscount);

// Update all fields of TypeOfBatch
router.put("/:id", updateAllFields);

// Delete a TypeOfBatch
router.delete("/:id", deleteTypeOfBatch);

module.exports = router;
