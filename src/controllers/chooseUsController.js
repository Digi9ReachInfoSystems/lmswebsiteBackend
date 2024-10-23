const ChooseUs = require('../models/chooseUsModel');
const { bucket } = require('../services/firebaseService'); // Firebase bucket
const multer = require('multer');

// Multer configuration for file upload
const upload = multer({ storage: multer.memoryStorage() }).single('image');

// CREATE: Add a new feature with image upload
const createChooseUsFeature = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading image', error: err });
    }

    const { name, description } = req.body;
    const file = req.file;

    if (!name || !description || !file) {
      return res.status(400).json({ message: 'Name, description, and image are required' });
    }

    try {
      // Upload the image to Firebase Storage
      const blob = bucket.file(`chooseUs/${Date.now()}_${file.originalname}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on('error', (error) => {
        return res.status(500).json({ message: 'Error uploading image', error });
      });

      blobStream.on('finish', async () => {
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        // Save the feature with the image URL to MongoDB
        const newFeature = new ChooseUs({ name, description, imageUrl });
        await newFeature.save();

        res.status(201).json({ message: 'Feature added successfully', feature: newFeature });
      });

      blobStream.end(file.buffer);
    } catch (error) {
      res.status(500).json({ message: 'Error adding feature', error });
    }
  });
};

// READ: Get all features
const getChooseUsData = async (req, res) => {
  try {
    const features = await ChooseUs.find(); // Fetch all features from MongoDB
    res.status(200).json({
      title: 'Why Choosing Us',
      features,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};
// Controller function to update a feature with optional image upload
const updateChooseUsFeature = async (req, res) => {
    try {
      // Use multer to handle file uploads
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: 'Error uploading image', error: err });
        }
  
        const { id } = req.params;
        const { name, description } = req.body;
        const file = req.file;
  
        // Find the existing feature by ID
        let feature = await ChooseUs.findById(id);
        if (!feature) {
          return res.status(404).json({ message: 'Feature not found' });
        }
  
        // Upload a new image if provided
        let imageUrl = feature.imageUrl; // Keep the existing image URL by default
        if (file) {
          const blob = bucket.file(`chooseUs/${Date.now()}_${file.originalname}`);
          const blobStream = blob.createWriteStream({
            metadata: {
              contentType: file.mimetype,
            },
          });
  
          // Upload the image and update the URL
          await new Promise((resolve, reject) => {
            blobStream.on('error', reject);
            blobStream.on('finish', () => {
              imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
              resolve();
            });
            blobStream.end(file.buffer);
          });
        }
  
        // Update the feature with new data
        feature.name = name || feature.name;
        feature.description = description || feature.description;
        feature.imageUrl = imageUrl;
  
        const updatedFeature = await feature.save();
  
        res.status(200).json({
          message: 'Feature updated successfully',
          feature: updatedFeature,
        });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating feature', error });
    }
  };

// DELETE: Delete a feature by ID
const deleteChooseUsFeature = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFeature = await ChooseUs.findByIdAndDelete(id);

    if (!deletedFeature) {
      return res.status(404).json({ message: 'Feature not found' });
    }

    res.status(200).json({ message: 'Feature deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feature', error });
  }
};

module.exports = {
  createChooseUsFeature,
  getChooseUsData,
  updateChooseUsFeature,
  deleteChooseUsFeature,
};
