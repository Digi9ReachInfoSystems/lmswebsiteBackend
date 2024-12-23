const axios = require("axios");
const firebaseConfig= require("../config/firebaseConfig");

// Controller to get access token using a refresh token
exports.getAccessToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    // Check if refresh_token is provided
    if (!refresh_token) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    // API endpoint and payload
    const url = `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.firebaseConfig.apiKey}`;
    const data = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    });

    // Make the API call
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Send the access token in response
    res.status(200).json({
      message: "Access token retrieved successfully",
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      refreshToken: response.data.refresh_token,
    });
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    res.status(500).json({
      error: error.response?.data?.error?.message || "Internal server error",
    });
  }
};