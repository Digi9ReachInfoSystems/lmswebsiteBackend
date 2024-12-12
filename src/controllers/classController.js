// src/controllers/classController.js

const Class = require("../models/classModel");
const Subject = require('../models/subjectModel');

// Create a new class/subject
exports.createClass = async (req, res) => {
  try {
    const { className, classLevel, curriculum ,imageLink,description} = req.body;

    if (!className || !classLevel || !curriculum) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newClass = new Class({
      className,
      classLevel,
      curriculum,
      image:imageLink,
      description

    });

    (await newClass.save()).populate("curriculum");
    res.status(201).json({ message: "Class created successfully", class: newClass });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all classes/subjects
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("curriculum");
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a class/subject
exports.updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { className, classLevel, curriculum } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { className, classLevel, curriculum },
      { new: true } // Returns the updated document
    ).populate({path:"curriculum", select:"name"});

    if (!updatedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.status(200).json({ message: "Class updated successfully", class: updatedClass });
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a class/subject
exports.deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const classData= await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ error: "Class not found" });
    }

    await Subject.deleteMany({ class_id: classId });

    const deletedClass = await Class.findByIdAndDelete(classId).populate("curriculum");

    if (!deletedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllClassesBoard = async (req, res) => {

  try {
    const { boardId } = req.params;
    const classes = await Class.find({curriculum:boardId}).populate("curriculum");
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const { classId } = req.params;
    const classData = await Class.findById(classId).populate("curriculum");
    if (!classData) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(200).json(classData);
  } catch (error) {
    console.error("Error fetching class by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};
