// controllers/typeOfBatchController.js
const TypeOfBatch = require("../models/typeOfBatchModel");

// Helper function to calculate discounted price
function calculateDiscountedPrice(price, discountPercentage) {
  if (!discountPercentage || discountPercentage <= 0) return price;
  const discountAmount = (price * discountPercentage) / 100;
  return price - discountAmount;
}

// Create a new TypeOfBatch
exports.createTypeOfBatch = async (req, res) => {
  try {
    const { mode, duration, price } = req.body;

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
    const batches = await TypeOfBatch.find();
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
    const { mode, price, duration, discountPercentage, discount_active } = req.body;

    const batch = await TypeOfBatch.findById(id);
    if (!batch) {
      return res.status(404).json({ error: "TypeOfBatch not found" });
    }

    if (mode !== undefined) batch.mode = mode;
    if (price !== undefined) batch.price = price;
    if (duration !== undefined) batch.duration = duration;
    if (discountPercentage !== undefined) batch.discountPercentage = discountPercentage;
    if (discount_active !== undefined) batch.discount_active = discount_active;

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
    const batch = await TypeOfBatch.find({ mode });

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
