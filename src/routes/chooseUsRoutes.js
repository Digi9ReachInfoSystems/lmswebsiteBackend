// routes/chooseusRoutes.js

const express = require('express');
const router = express.Router();
const chooseUsController = require('../controllers/chooseUsController');
const authMiddleware = require("../middlewares/authMiddleware"); // Assuming you have this for protected routes
const authorizeRole = require("../middlewares/authorizeRole");

// GET route to fetch all features
router.get('/getData', chooseUsController.getChooseUsData);

router.post("/create", authMiddleware, authorizeRole("admin"),chooseUsController.createChooseUsFeature);

router.put("/update/:id", authMiddleware, authorizeRole("admin"), chooseUsController.updateChooseUsFeature);

router.delete("/delete/:id", authMiddleware, authorizeRole("admin"), chooseUsController.deleteChooseUsFeature);

module.exports = router;
