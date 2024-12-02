// src/controllers/contentController.js
const Content = require('../models/contentModel');
const Batch = require('../models/batchModel');
const Teacher = require('../models/teacherModel');
const { bucket } = require('../services/firebaseService');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
/**
 * Upload content with batch, teacher info, and material link.
 */
const uploadContent = async (req, res) => {
    try {
        const { batchId, teacherId, materialLink,description } = req.body;

        // Validate required fields
        if (!materialLink || !batchId || !teacherId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Fetch batch details using batchId
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        // Fetch teacher details by matching user_id with teacherId
        const teacher = await Teacher.findById( teacherId );
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Create a new content document in MongoDB
        const content = new Content({
            batch: {
                _id: batch._id,
                batch_name: batch.batch_name,
            },
            teacher_id: teacher._id,

            material_link: materialLink,
            description: description
        });

        await content.save(); // Save the content document

        // Return success response
        res.status(201).json({
            message: 'Content uploaded successfully',
            content,
        });


    } catch (error) {
        console.error('Error uploading content:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Get all content records.
 */
const getAllContent = async (req, res) => {
    try {
        const contentList = await Content.find().populate('batch._id');
        res.status(200).json(contentList);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
};


/**
 * Get content by teacherId
 */
const getContentByTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.params;

        // Find content where teacher_id matches the given teacherId
        const contentList = await Content.find({ teacher_id: teacherId });

        if (contentList.length === 0) {
            return res.status(404).json({ error: 'No content found for this teacher' });
        }

        res.status(200).json(contentList);
    } catch (error) {
        console.error('Error fetching content by teacherId:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
};

/**
 * Get content by batchId
 */
const getContentByBatchId = async (req, res) => {
    try {
        const { batchId } = req.params;

        // Find content where batch._id matches the given batchId
        const contentList = await Content.find({ 'batch._id': batchId });

        if (contentList.length === 0) {
            return res.status(404).json({ error: 'No content found for this batch' });
        }

        res.status(200).json(contentList);
    } catch (error) {
        console.error('Error fetching content by batchId:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
};
module.exports = {
    uploadContent,
    getAllContent,
    getContentByTeacherId,
    getContentByBatchId
};
