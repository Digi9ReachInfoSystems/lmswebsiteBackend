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
        const { batchId, teacherId } = req.body;

        // Validate required fields
        if (!req.file || !batchId || !teacherId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Fetch batch details using batchId
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        // Fetch teacher details by matching user_id with teacherId
        const teacher = await Teacher.findOne({ user_id: teacherId });
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Generate a unique filename for the uploaded file
        const fileName = `batch_material/${uuidv4()}${path.extname(req.file.originalname)}`;
        const file = bucket.file(fileName); // Get reference to Firebase file

        // Upload the file to Firebase Storage
        const blobStream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype, // Use the file’s mimetype
                firebaseStorageDownloadTokens: uuidv4(), // Generate a unique download token
            },
        });

        blobStream.on('error', (error) => {
            console.error('Error uploading material to Firebase:', error);
            return res.status(500).json({ error: 'File upload error' });
        });

        blobStream.on('finish', async () => {
            // Generate the public URL for the uploaded file
            const materialLink = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

            // Create a new content document in MongoDB
            const content = new Content({
                batch: {
                    _id: batch._id,
                    batch_name: batch.batch_name,
                },
                teacher_id: teacher._id,

                material_link: materialLink,
            });

            await content.save(); // Save the content document

            // Return success response
            res.status(201).json({
                message: 'Content uploaded successfully',
                content,
            });
        });

        // Write the file buffer to Firebase (upload the file)
        blobStream.end(req.file.buffer);
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
