const axios = require('axios');

/**
 * Controller to handle refreshing the access token using the Google Secure Token API.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.refreshAccessToken = async (req, res) => {
  try {
    // Extract refresh token from the request headers
    const refreshToken = req.headers['x-refresh-token'];
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Prepare request body with x-www-form-urlencoded format
    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'refresh_token');
    requestBody.append('refresh_token', refreshToken);

    // Call the Google Secure Token API
    const response = await axios.post(
      'https://securetoken.googleapis.com/v1/token?key=AIzaSyDZF4e9nAL17nGTaTT9Tehmht9M73HsaR4',
      requestBody,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    // Return the API response to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error refreshing access token:', error.message);

    // Handle different error scenarios
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
