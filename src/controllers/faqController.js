// controllers/faqController.js
const FAQ = require('../models/faqModel');

// Create a new FAQ
exports.createFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const newFAQ = new FAQ({ question, answer });
        await newFAQ.save();
        res.status(201).json({ message: 'FAQ created', data: newFAQ });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single FAQ by ID
exports.getFAQById = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });
        res.status(200).json(faq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an FAQ by ID
exports.updateFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const updatedFAQ = await FAQ.findByIdAndUpdate(
            req.params.id,
            { question, answer, updatedAt: Date.now() },
            { new: true }
        );
        if (!updatedFAQ) return res.status(404).json({ message: 'FAQ not found' });
        res.status(200).json({ message: 'FAQ updated', data: updatedFAQ });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an FAQ by ID
exports.deleteFAQ = async (req, res) => {
    try {
        const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
        if (!deletedFAQ) return res.status(404).json({ message: 'FAQ not found' });
        res.status(200).json({ message: 'FAQ deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
