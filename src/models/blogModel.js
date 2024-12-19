// models/BlogModel.js

const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
      trim: true,
      validate: {
        validator: function (v) {
          // Simple URL validation regex
          return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        },
        message: 'Please enter a valid URL for the image',
      },
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    author: {
      type: String,
      required: [true, 'Please add an author'],
      trim: true,
      maxlength: [50, 'Author name cannot exceed 50 characters'],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Blog', BlogSchema);
