// src/routes/benefitsRoutes.js

const express = require('express');
const router = express.Router();
const benefitsController = require('../controllers/benefitsController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

// Create a new benefit
router.post('/',authMiddleware,authorizeRole("admin"), benefitsController.createBenefit);

// Get all benefits
router.get('/', benefitsController.getAllBenefits);

// Get a benefit by ID
router.get('/:benefitId', benefitsController.getBenefitById);

// Update a benefit by ID
router.put('/:benefitId', authMiddleware,authorizeRole("admin"),benefitsController.updateBenefit);

// Delete a benefit by ID
router.delete('/:benefitId',authMiddleware,authorizeRole("admin"), benefitsController.deleteBenefit);

module.exports = router;
