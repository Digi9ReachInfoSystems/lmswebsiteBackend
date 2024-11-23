const express = require("express");
const router = express.Router();
const { getAccessToken } = require("../controllers/refreshTokenController");

// Route to get access token using refresh token
router.post("/get-access-token", getAccessToken);

module.exports = router;