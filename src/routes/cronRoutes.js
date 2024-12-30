const express = require('express');
const router = express.Router();
const cronController = require('../controllers/cronController');

// Route to run cron job    
router.get('/run-cron-job', cronController.cron);

module.exports = router;