// models/chooseusModel.js

const mongoose = require('mongoose');

// Define the schema for ChooseUs feature
const ChooseUsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true, // URL of the image uploaded to Firebase
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model from the schema
module.exports = mongoose.model('ChooseUs', ChooseUsSchema);
