// routes/faqRoutes.js
const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

const authMiddleware = require("../middlewares/authMiddleware"); // Assuming you have this for protected routes
const authorizeRole = require("../middlewares/authorizeRole");
const { auth } = require('firebase-admin');

// Create a new FAQ
router.post('/create',authMiddleware, authorizeRole("admin"), faqController.createFAQ);

// Get all FAQs
router.get('/all', faqController.getAllFAQs);

// Get a single FAQ by ID
router.get('/getBySingleId/:id', faqController.getFAQById);

// Update an FAQ by ID
router.put('/updateById/:id',authMiddleware, authorizeRole("admin"), faqController.updateFAQ);

// Delete an FAQ by ID
router.delete('/delete/:id',authMiddleware, authorizeRole("admin"), faqController.deleteFAQ);

module.exports = router;
