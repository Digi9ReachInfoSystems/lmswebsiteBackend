const express = require('express');
const router = express.Router();
const { refreshAccessToken } = require('../controllers/tempController');

// Route to handle access token refresh
router.post('/refresh-token', refreshAccessToken);

module.exports = router;