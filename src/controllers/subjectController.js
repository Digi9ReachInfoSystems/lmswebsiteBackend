const Subject = require("../models/subjectModel");

exports.createSubject = async (req, res) => {
  try {
    const {
      subject_name,
      class_id,
      language,
      approval_status,
      is_grammar_subject,
      subject_image,

    } = req.body;

    if (!subject_name || !class_id || !language) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newSubject = new Subject({
      subject_name,
      subject_image,
      class_id,
      language,
      approval_status,
      is_grammar_subject,
    });
    await newSubject.save();
    res
      .status(201)
      .json({ message: "Subject created successfully", subject: newSubject });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getallSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateSubjects = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const {
      subject_name,
      class_id,
      language,
      subject_image,
      approval_status,
      is_grammar_subject,
    } = req.body;
    const updatedSubject = await Subject.findByIdAndUpdate(
      subject_id,
      {
        subject_name,
        class_id,
        subject_image,
        language,
        approval_status,
        is_grammar_subject,
      },
      { new: true }
    );
    if (!updatedSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.status(200).json({
      message: "Subject updated successfully",
      subject: updatedSubject,
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const deletedSubject = await Subject.findByIdAndDelete(subject_id);
    if (!deletedSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.status(200).json({
      message: "Subject deleted successfully",
      subject: deletedSubject,
    });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ error: "Server error" });
  }
};