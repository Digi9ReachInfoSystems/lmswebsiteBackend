// src/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController'); // Adjust the path as necessary

// Route to get statistics
router.get('/statistics', statsController.getStatistics);

module.exports = router;