// src/controllers/customPackageController.js

const CustomPackage = require("../models/customPackageModels");
const mongoose = require("mongoose");
const Student = require("../models/studentModel");

// Controller for creating a custom package
exports.createCustomPackage = async (req, res) => {
  try {
    let { student_id, subject_id } = req.body;

    // Ensure subject_id is an array and has at least 3 subjects
    if (!Array.isArray(subject_id) || subject_id.length < 3) {
      return res
        .status(400)
        .json({ error: "At least 3 subjects are required" });
    }

    // Convert subject_ids to ObjectId instances
    const objectIdSubjects = subject_id.map((subject) => {
      if (!mongoose.Types.ObjectId.isValid(subject)) {
        throw new Error(`Invalid subject ID: ${subject}`);
      }
      return new mongoose.Types.ObjectId(subject);
    });

    // Validate and convert student_id
    if (!student_id || !mongoose.Types.ObjectId.isValid(student_id)) {
      return res.status(400).json({ error: "Invalid or missing student ID" });
    }
    const studentId = new mongoose.Types.ObjectId(student_id);

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Create a new custom package with default values for admin-related fields
    const newCustomPackage = new CustomPackage({
      is_active: false,
      student_id: studentId,
      subject_id: objectIdSubjects,
      is_approved: false,
      package_price: 0,
      is_price_finalized: false,
      admin_contacted: false,
      admin_notes: "",
      // slots: slots,
    });

    const savedCustomPackage = await newCustomPackage.save();

    // Update the student document
    student.custom_package_id = savedCustomPackage._id;
    student.custom_package_status = "pending";
    await student.save();

    res.status(201).json({
      message: "Custom package created successfully",
      customPackage: savedCustomPackage,
      student: student,
    });
  } catch (error) {
    console.error("Error creating custom package:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// Controller for updating a custom package (admin use)
exports.updateCustomPackage = async (req, res) => {
  try {
    const { package_id } = req.params;
    const {
      is_approved,
      package_price,
      is_price_finalized,
      admin_contacted,
      admin_notes,
      is_active,
      expiry_date,
      duration
    } = req.body;

    // Find the custom package by ID
    const customPackage = await CustomPackage.findById(package_id);
    if (!customPackage) {
      return res.status(404).json({ error: "Custom package not found" });
    }

    // Update the fields if they are provided
    if (is_approved !== undefined) customPackage.is_approved = is_approved;
    if (package_price !== undefined)
      customPackage.package_price = package_price;
    if (is_price_finalized !== undefined)
      customPackage.is_price_finalized = is_price_finalized;
    if (admin_contacted !== undefined)
      customPackage.admin_contacted = admin_contacted;
    if (admin_notes !== undefined) customPackage.admin_notes = admin_notes;
    if (is_active !== undefined) customPackage.is_active = is_active;
    if (expiry_date !== undefined) customPackage.expiry_date = expiry_date;
    if (duration !== undefined) customPackage.duration = duration;

    await customPackage.save();

    res.status(200).json({
      message: "Custom package updated successfully",
      customPackage,
    });
  } catch (error) {
    console.error("Error updating custom package:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// Controller for getting all custom packages
exports.getPackages = async (req, res) => {
  try {
    const packages = await CustomPackage.find()
      .populate("subject_id", "subject_name")
      .populate({
        path: "student_id",
        populate:(["user_id","class","type_of_batch"]),
      })
      .exec();

    res.status(200).json({
      message: "Custom packages fetched successfully",
      packages,
    });
  } catch (error) {
    console.error("Error fetching custom packages:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// Controller for getting a single custom package by ID
exports.getCustomPackageById = async (req, res) => {
  try {
    const { package_id } = req.params;

    const customPackage = await CustomPackage.findById(package_id)
      .populate("user_id", "name email")
      .populate("student_id", "name email")
      .populate("subject_id", "subject_name")
      .exec();

    if (!customPackage) {
      return res.status(404).json({ error: "Custom package not found" });
    }

    res.status(200).json({
      message: "Custom package fetched successfully",
      customPackage,
    });
  } catch (error) {
    console.error("Error fetching custom package:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};
