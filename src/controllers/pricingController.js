const Pricing = require("../models/pricingModel"); // Adjust path as needed

// Get the discount field
exports.getDiscount = async (req, res) => {
  try {
    const pricing = await Pricing.findOne(); // Retrieve the pricing document (you can add filters if you need more specific data)
    if (!pricing) {
      return res.status(404).json({ message: "Pricing data not found" });
    }
    return res.status(200).json({ discount: pricing.discount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the GST field
exports.getGst = async (req, res) => {
  try {
    const pricing = await Pricing.findOne(); // Retrieve the pricing document
    if (!pricing) {
      return res.status(404).json({ message: "Pricing data not found" });
    }
    return res.status(200).json({ gst: pricing.gst });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the discount field
exports.updateDiscount = async (req, res) => {
  const { discount } = req.body; // Assuming you send the new discount in the request body
  try {
    if (typeof discount !== "number" || discount < 0 || discount > 100) {
      return res.status(400).json({ message: "Discount must be a number between 0 and 100" });
    }
    const pricing = await Pricing.findOne(); // Retrieve the pricing document
    if (!pricing) {
      return res.status(404).json({ message: "Pricing data not found" });
    }
    pricing.discount = discount; // Update discount field
    await pricing.save(); // Save the updated pricing
    return res.status(200).json({ message: "Discount updated successfully", discount: pricing.discount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the GST field
exports.updateGst = async (req, res) => {
  const { gst } = req.body; // Assuming you send the new GST in the request body
  try {
    if (typeof gst !== "number" || gst < 0 || gst > 100) {
      return res.status(400).json({ message: "GST must be a number between 0 and 100" });
    }
    const pricing = await Pricing.findOne(); // Retrieve the pricing document
    if (!pricing) {
      return res.status(404).json({ message: "Pricing data not found" });
    }
    pricing.gst = gst; // Update gst field
    await pricing.save(); // Save the updated pricing
    return res.status(200).json({ message: "GST updated successfully", gst: pricing.gst });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new pricing record with discount and gst
exports.createPricing = async (req, res) => {
    const { discount, gst } = req.body;
  
    try {
      // Validate input
      if (typeof discount !== "number" || discount < 0 || discount > 100) {
        return res.status(400).json({ message: "Discount must be a number between 0 and 100" });
      }
      if (typeof gst !== "number" || gst < 0 || gst > 100) {
        return res.status(400).json({ message: "GST must be a number between 0 and 100" });
      }
  
      // Create new pricing document
      const newPricing = new Pricing({
        discount: discount,
        gst: gst
      });
  
      // Save the new pricing record
      await newPricing.save();
  
      return res.status(201).json({
        message: "Pricing created successfully",
        pricing: newPricing
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  