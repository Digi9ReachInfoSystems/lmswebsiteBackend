// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.get('/profile',authMiddleware,  userController.getProfile);

// Define route to get user details by auth_id
router.get('/userByAuthId', userController.getUserByAuthId);

module.exports = router;
