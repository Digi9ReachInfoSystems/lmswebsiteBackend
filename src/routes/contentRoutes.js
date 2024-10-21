// src/routes/contentRoutes.js
const express = require('express');
const multer = require('multer'); // Middleware for handling form-data
const {
  uploadContent,
  getAllContent,
  getContentByTeacherId,
  getContentByBatchId
} = require('../controllers/contentController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRole = require("../middlewares/authorizeRole");

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary file storage

// Route to upload content
router.post('/upload',authMiddleware,authorizeRole("teacher"), upload.single('file'), uploadContent);

// Route to get all content
router.get('/', getAllContent);


// Route to get content by teacherId
router.get('/teacher/:teacherId', getContentByTeacherId);

// Route to get content by batchId
router.get('/batch/:batchId', getContentByBatchId);

module.exports = router;
