const CircularNotifications = require("../models/circularNotificationsModel");
const { bucket } = require("../services/firebaseService");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Import the CircularNotifications model

exports.getCircularNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const circularNotification = await CircularNotifications.findById(id)
      .populate("user_id", "name email")
      .exec();

    if (!circularNotification) {
      return res.status(404).json({ error: "Circular notification not found" });
    }

    res.status(200).json({
      message: "Circular notification fetched successfully",
      circularNotification,
    });
  } catch (error) {
    console.error("Error fetching circular notification:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all circular notifications
exports.getAllCircularNotifications = async (req, res) => {
  try {
    const circularNotifications = await CircularNotifications.find()
      .populate("user_id", "name email") // Populates user details if necessary
      .exec();

    res.status(200).json({
      message: "Circular notifications fetched successfully",
      circularNotifications,
    });
  } catch (error) {
    console.error("Error fetching circular notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a circular notification
exports.updateCircularNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { circularName, validDate, content, is_active } = req.body;

    // Find the circular notification by ID
    const circularNotification = await CircularNotifications.findById(id);

    if (!circularNotification) {
      return res.status(404).json({ error: "Circular notification not found" });
    }

    // Update the fields if they are provided
    if (circularName !== undefined)
      CircularNotifications.circularName = circularName;
    if (validDate !== undefined) circularNotification.validDate = validDate;
    if (content !== undefined) circularNotification.content = content;
    if (is_active !== undefined) circularNotification.is_active = is_active;

    await circularNotification.save();

    res.status(200).json({
      message: "Circular notification updated successfully",
      CircularNotifications,
    });
  } catch (error) {
    console.error("Error updating circular notification:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createCircularNotification = async (req, res) => {
  try {
    const { circularName, validDate, content } = req.body;

    if (!circularName || !validDate || !content||!req.file) {
      return res
        .status(400)
        .json({ error: "circularName, validDate, and content are required" });
    }

    const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const file = bucket.file(fileName);

    const blobStream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        firebaseStorageDownloadTokens: uuidv4(),
      },
    });

    blobStream.on("error", (error) => {
      console.error("Error uploading file to Firebase:", error);
      return res.status(500).json({ error: "File upload error" });
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}?alt=media`;

      const newCircular = new CircularNotifications({
        image: publicUrl,
        circularName,
        validDate,
        content,
      });

      await newCircular.save();

      res.status(201).json({
        message: "Circular notification created successfully",
        circularNotification: newCircular,
      });
    });
    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error("Error creating circular notification:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteCircularNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the circular notification by ID
    const circularNotification = await CircularNotifications.findById(id);

    if (!circularNotification) {
      return res.status(404).json({ error: "Circular notification not found" });
    }

    // Delete the circular notification
    await CircularNotifications.findByIdAndDelete(id);

    res.status(200).json({
      message: "Circular notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting circular notification:", error);
    res.status(500).json({ error: "Server error" });
  }
};
