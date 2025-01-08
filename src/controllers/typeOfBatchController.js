// controllers/typeOfBatchController.js
const { populate } = require("../models/studentModel");
const TypeOfBatch = require("../models/typeOfBatchModel");
const mongoose = require("mongoose");

// Helper function to calculate discounted price
function calculateDiscountedPrice(price, discountPercentage) {
  if (!discountPercentage || discountPercentage <= 0) return price;
  const discountAmount = (price * discountPercentage) / 100;
  return price - discountAmount;
}

// Create a new TypeOfBatch
exports.createTypeOfBatch = async (req, res) => {
  try {
    const { mode, duration, price, features, title, subject_id,class_id, custom_batch } = req.body;
    console.log(req.body);

    // Basic validation
    if (!mode || !price) {
      return res.status(400).json({ error: "Mode and Price are required" });
    }

    const newBatch = new TypeOfBatch({
      mode,
      duration,
      price,
      discountPercentage: 0,
      discountedPrice: price,
      discount_active: false,
      feature: features,
      title: title,
      subject_id: subject_id,
      custom_batch: custom_batch || false,
      class_id: class_id,
    });

    await newBatch.save();

    res.status(201).json({ message: "TypeOfBatch created successfully", data: newBatch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single TypeOfBatch by ID
exports.getSingleTypeOfBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await TypeOfBatch.findById(id);
    if (!batch) {
      return res.status(404).json({ error: "TypeOfBatch not found" });
    }
    res.status(200).json(batch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all TypeOfBatch
exports.getAllTypeOfBatch = async (req, res) => {
  try {
    const batches = await TypeOfBatch.find().populate(
      { path: "subject_id", populate: { path: "class_id", populate: { path: "curriculum" } } },
    )
    .populate({path:"class_id", populate:{path:"curriculum"}})
    .sort({ mode: 1 }); 
    res.status(200).json(batches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update only the discount percentage (and recalculate discounted price)
exports.updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { discountPercentage } = req.body;

    const batch = await TypeOfBatch.findById(id);
    if (!batch) {
      return res.status(404).json({ error: "TypeOfBatch not found" });
    }

    if (typeof discountPercentage !== "number") {
      return res.status(400).json({ error: "Discount percentage must be a number" });
    }

    batch.discountPercentage = discountPercentage;
    batch.discountedPrice = calculateDiscountedPrice(batch.price, discountPercentage);
    batch.discount_active = discountPercentage > 0 ? true : false;

    await batch.save();

    res.status(200).json({ message: "Discount updated successfully", data: batch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update all fields of TypeOfBatch
exports.updateAllFields = async (req, res) => {
  try {
    const { id } = req.params;
    const { mode, price, title, duration, discountPercentage, discount_active, feature } = req.body;

    const batch = await TypeOfBatch.findById(id);
    if (!batch) {
      return res.status(404).json({ error: "TypeOfBatch not found" });
    }

    if (mode !== undefined) batch.mode = mode;
    if (price !== undefined) batch.price = price;
    if (title !== undefined) batch.title = title;
    if (duration !== undefined) batch.duration = duration;
    if (discountPercentage !== undefined) batch.discountPercentage = discountPercentage;
    if (discount_active !== undefined) batch.discount_active = discount_active;
    if (feature !== undefined) batch.feature = feature;

    // Recalculate discounted price if discountPercentage or price changes
    batch.discountedPrice = calculateDiscountedPrice(batch.price, batch.discountPercentage);

    await batch.save();

    res.status(200).json({ message: "TypeOfBatch updated successfully", data: batch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a TypeOfBatch
exports.deleteTypeOfBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await TypeOfBatch.findByIdAndDelete(id);
    if (!batch) {
      return res.status(404).json({ error: "TypeOfBatch not found" });
    }
    res.status(200).json({ message: "TypeOfBatch deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Controller to get a batch type by mode
exports.getBatchByMode = async (req, res) => {
  try {
    // Extract the 'mode' parameter from the request query or body
    const { mode } = req.params;

    // Validate mode input
    if (!mode) {
      return res.status(400).json({ error: "Mode is required" });
    }

    // Find the batch type by mode
    const batch = await TypeOfBatch.find({ mode })
    .sort({ mode: 1 }); 

    // If no batch type found
    if (!batch) {
      return res.status(404).json({ error: "No batch found with the specified mode" });
    }

    // Respond with the batch details
    res.status(200).json({ success: true, data: batch });
  } catch (error) {
    console.error("Error fetching batch by mode:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
/**
 * Controller to get all TypeOfBatch documents by a specific subject ID
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @route GET /api/typeOfBatch/subject/:subjectId
 */
exports.getTypeOfBatchBySubjectId = async (req, res) => {
  try {
    // const { subjectId } = req.params;
    const subjectId = new mongoose.Types.ObjectId( req.params.subjectId);
    console.log(subjectId);

    // Find all TypeOfBatch docs where subject_id matches subjectId
    const batches = await TypeOfBatch.find({ subject_id: subjectId }).populate("subject_id")
    .sort({ mode: 1 }); 

    // If no records are found, return an empty array or 404, depending on your design
    if (!batches || batches.length === 0) {
      // Could also return res.status(404).json({ error: "No batches found for this subject" });
      return res.status(200).json([]);
    }

    return res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching typeOfBatch by subject ID:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getCustomTypeOfBatch = async (req, res) => {
  try {


    // Find all TypeOfBatch docs where subject_id matches subjectId
    const batch = await TypeOfBatch.find({ custom_batch: true }).populate("subject_id")
    .sort({ mode: 1 }); 

    if (!batch || batch.length === 0) {
      return res.status(404).json({ error: "No custom type of batch found " });
    }

    // Respond with the batch details
    return res.status(200).json(batch);
  } catch (error) {
    console.error("Error fetching custom type of batch ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTypeOfBatchByClassId = async (req, res) => {
  try {
    const { ClassId,batchType } = req.params;

    // Find all TypeOfBatch docs where subject_id matches subjectId
    const batches = await TypeOfBatch.find({ class_id: ClassId,custom_batch:batchType }).populate("subject_id").populate("class_id")
    .sort({ mode: 1 }); 

    // If no records are found, return an empty array or 404, depending on your design
    if (!batches || batches.length === 0) {
      // Could also return res.status(404).json({ error: "No batches found for this subject" });
      return res.status(200).json([]);
    }

    return res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching typeOfBatch by subject ID:", error);
    return res.status(500).json({ error: "Server error" });
  }
};