// src/controllers/benefitsController.js

const Benefits = require('../models/benefitsModel');

// Create a new benefit
exports.createBenefit = async (req, res) => {
    try {
        const { title, description, color } = req.body;

        const newBenefit = new Benefits({ title, description, color });
        await newBenefit.save();

        res.status(201).json({
            message: 'Benefit created successfully',
            benefit: newBenefit,
        });
    } catch (error) {
        console.error('Error creating benefit:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all benefits
exports.getAllBenefits = async (req, res) => {
    try {
        const benefits = await Benefits.find();
        res.status(200).json({
            message: 'Benefits fetched successfully',
            benefits,
        });
    } catch (error) {
        console.error('Error fetching benefits:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a benefit by ID
exports.getBenefitById = async (req, res) => {
    try {
        const { benefitId } = req.params;

        const benefit = await Benefits.findById(benefitId);
        if (!benefit) {
            return res.status(404).json({ error: 'Benefit not found' });
        }

        res.status(200).json({
            message: 'Benefit fetched successfully',
            benefit,
        });
    } catch (error) {
        console.error('Error fetching benefit:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a benefit by ID
exports.updateBenefit = async (req, res) => {
    try {
        const { benefitId } = req.params;
        const { title, description, color } = req.body;

        const updatedBenefit = await Benefits.findByIdAndUpdate(
            benefitId,
            { title, description, color },
            { new: true, runValidators: true }
        );

        if (!updatedBenefit) {
            return res.status(404).json({ error: 'Benefit not found' });
        }

        res.status(200).json({
            message: 'Benefit updated successfully',
            benefit: updatedBenefit,
        });
    } catch (error) {
        console.error('Error updating benefit:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a benefit by ID
exports.deleteBenefit = async (req, res) => {
    try {
        const { benefitId } = req.params;

        const deletedBenefit = await Benefits.findByIdAndDelete(benefitId);
        if (!deletedBenefit) {
            return res.status(404).json({ error: 'Benefit not found' });
        }

        res.status(200).json({
            message: 'Benefit deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting benefit:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
