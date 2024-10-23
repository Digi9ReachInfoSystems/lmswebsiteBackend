const Course = require('../models/courseModel');
const Class = require('../models/classModel');
const mongoose = require('mongoose');
const { bucket } = require('../services/firebaseService'); // Firebase storage bucket
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Helper function to upload an image to Firebase Storage
async function uploadImageToFirebase(file) {
  const fileName = `courses/${uuidv4()}${path.extname(file.originalname)}`;
  const fileRef = bucket.file(fileName);

  return new Promise((resolve, reject) => {
    const stream = fileRef.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        firebaseStorageDownloadTokens: uuidv4(), // Token for public access
      },
    });

    stream.on('error', (error) => {
      console.error('Error uploading image:', error);
      reject('Image upload failed');
    });

    stream.on('finish', () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
        fileName
      )}?alt=media`;
      resolve(publicUrl);
    });

    stream.end(file.buffer); // Upload the file buffer
  });
}

// Get all courses with populated class field
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('class');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new course with image upload
exports.createCourse = async (req, res) => {
  try {
    const { title, class: classId, price } = req.body;

    if (!req.file || !title || !classId || !price) {
      return res.status(400).json({ message: 'All fields and image are required' });
    }

    // Upload image to Firebase Storage
    const imgurl = await uploadImageToFirebase(req.file);

    // Create and save the course in the database
    const newCourse = new Course({
      imgurl,
      title,
      class: classId,
      price,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a course by ID with populated class field
exports.getCourseById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findById(req.params.id).populate('class');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a course by ID
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    // Find the existing course
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Log the incoming file and body to debug
    console.log('File:', req.file);
    console.log('Body:', req.body);

    // Check if a new image is provided
    let imgurl = existingCourse.imgurl; // Retain the existing image URL by default
    if (req.file) {
      imgurl = await uploadImageToFirebase(req.file); // Upload new image and update URL
    }

    // Extract other fields from form-data
    const { title, class: classId, price } = req.body;

    // Prepare the data for updating
    const updatedData = {
      title: title ,//|| existingCourse.title,
      price: price,// || existingCourse.price,
      imgurl, // Use either the existing or newly uploaded image URL
    };

    // Perform the update
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedData, {
      new: true,
      runValidators: true, // Ensure validation is applied
    });

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found after update' });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: error.message });
  }
};


// Delete a course by ID
exports.deleteCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getSingleCourseFromEachClass = async (req, res) => {
  try {
      // Fetch all classes
      const classes = await Class.find();
      const courses = await Course.find();

      // Create an array to hold the result
      const result = [];

      // Iterate over each class and find one course
      for (const cls of classes) {
          // Find one course from the current class
          const course = courses.find(course => course.class.toString() === cls._id.toString());
          if (course) {
              result.push({
                  classId: cls._id,
                  className: cls.className,
                  classLevel: cls.classLevel,
                  curriculum: cls.curriculum,
                  courseId: course._id,
                  courseTitle: course.title,
                  coursePrice: course.price
              });
          }
      }

      res.status(200).json({
          message: 'Single course fetched from each class successfully',
          courses: result
      });
  } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Server error' });
  }
};
