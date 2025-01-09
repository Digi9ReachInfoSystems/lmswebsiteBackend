const express = require("express");
const router = express.Router();
const {
  getDiscount,
  getGst,
  updateDiscount,
  updateGst,
  createPricing,  // Import the createPricing function
} = require("../controllers/pricingController"); // Adjust path as needed

// Get discount
router.get("/discount", getDiscount);

// Get GST
router.get("/gst", getGst);

// Update discount
router.put("/discount", updateDiscount);

// Update GST
router.put("/gst", updateGst);

// Create new pricing
router.post("/", createPricing); // POST route to create new pricing

module.exports = router;
