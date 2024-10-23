//src/controllers/packagesController.js

const Package = require("../models/packagesModel");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { bucket } = require("../services/firebaseService");
const mongoose = require("mongoose");

/**
 * @api {get} /packages/class/:class_id Get packages by class
 * @apiName getPackagesByClass
 * @apiGroup Packages
 * @apiParam {String} class_id The ID of the class to get packages for
 * @apiSuccess {Object[]} packages The packages associated with the given class_id
 * @apiError {Object} 400 Bad Request - class_id is required or has an invalid format
 * @apiError {Object} 500 Server Error - error fetching packages by class_id
 */
exports.getPackagesByClass = async (req, res) => {
  try {
    const { class_id } = req.params;

    // Validate class_id
    if (!class_id) {
      return res.status(400).json({ error: "class_id is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(class_id)) {
      return res.status(400).json({ error: "Invalid class_id format" });
    }

    const packages = await Package.find({ class_id }).populate(
      "subject_id",
      "subject_name"
    );

    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages by class_id:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

/**
 * @api {get} /packages Get all packages
 * @apiName getAllPackages
 * @apiGroup Packages
 * @apiSuccess {Object[]} packages The packages available
 * @apiError {Object} 500 Server Error - error fetching packages
 */
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate(
      "subject_id",
      "subject_name"
    );
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};
/**
 * @api {post} /packages Create a package
 * @apiName createPackage
 * @apiGroup Packages
 * @apiParam {String} package_name The name of the package
 * @apiParam {String} description The description of the package
 * @apiParam {String} features The features of the package in JSON format
 * @apiParam {ObjectId} class_id The class_id of the package
 * @apiParam {ObjectId[]} subject_id The subject_id(s) of the package
 * @apiParam {Number} price The price of the package
 * @apiParam {File} image The image of the package
 * @apiSuccess {Object} package The created package
 * @apiError {Object} 400 Bad Request - missing required fields or invalid format
 * @apiError {Object} 500 Server Error - error creating package
 */
exports.createPackage = async (req, res) => {
  try {
    const { package_name, description, features, class_id, subject_id, price } =
      req.body;

    if (
      !package_name ||
      !description ||
      !features ||
      !class_id ||
      !subject_id ||
      !price
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    let featuresArray;
    try {
      featuresArray = JSON.parse(features);
    } catch (error) {
      return res.status(400).json({ error: "Invalid features format" });
    }

    let subjectIdsArray;
    try {
      subjectIdsArray = JSON.parse(subject_id);
      if (!Array.isArray(subjectIdsArray) || subjectIdsArray.length === 0) {
        return res.status(400).json({ error: "Invalid subject_ids format" });
      }
    } catch (error) {
      return res.status(400).json({ error: "Invalid subject_ids format" });
    }

    const filename = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const file = bucket.file(filename);
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
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${filename}?alt=media`;

      const newPackage = new Package({
        package_name,
        image: publicUrl,
        description,
        features,
        class_id,
        subject_id: subjectIdsArray,
        price,
      });
      const savedPackage = await newPackage.save();

      res.status(201).json({
        message: "Package created successfully",
        package: savedPackage,
      });
    });
    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

/**
 * @api {put} /packages/:id Update a package by ID
 * @apiName updatePackage
 * @apiGroup Packages
 * @apiParam {String} id The ID of the package to update
 * @apiParam {String} [package_name] The new name of the package
 * @apiParam {String} [description] The new description of the package
 * @apiParam {String} [features] The new features of the package in JSON format
 * @apiParam {ObjectId} [class_id] The new class_id of the package
 * @apiParam {ObjectId[]} [subject_ids] The new subject_ids of the package
 * @apiParam {Number} [price] The new price of the package
 * @apiParam {File} [image] The new image of the package
 * @apiSuccess {Object} package The updated package
 * @apiError {Object} 400 Bad Request - Invalid ID format or invalid data
 * @apiError {Object} 404 Not Found - Package not found
 * @apiError {Object} 500 Server Error - Error updating package
 */
exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid package ID format" });
    }

    // Find the package
    const package = await Package.findById(id);
    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Update fields
    const {
      package_name,
      description,
      features,
      class_id,
      subject_ids,
      price,
    } = req.body;

    // Update fields if provided
    if (package_name) package.package_name = package_name;
    if (description) package.description = description;
    if (features) {
      try {
        const featuresArray = JSON.parse(features);
        package.features = featuresArray;
      } catch (error) {
        return res.status(400).json({ error: "Invalid features format" });
      }
    }
    if (class_id) package.class_id = class_id;
    if (subject_ids) {
      try {
        const subjectIdsArray = JSON.parse(subject_ids);
        if (!Array.isArray(subjectIdsArray) || subjectIdsArray.length === 0) {
          return res.status(400).json({ error: "Invalid subject_ids format" });
        }
        package.subject_ids = subjectIdsArray;
      } catch (error) {
        return res.status(400).json({ error: "Invalid subject_ids format" });
      }
    }
    if (price) package.price = price;

    // Handle image upload if a new image is provided
    if (req.file) {
      const filename = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const file = bucket.file(filename);
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
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${filename}?alt=media`;

        // Update the image URL
        package.image = publicUrl;

        // Save the updated package
        const updatedPackage = await package.save();

        res.status(200).json({
          message: "Package updated successfully",
          package: updatedPackage,
        });
      });

      blobStream.end(req.file.buffer);
    } else {
      // Save the updated package without changing the image
      const updatedPackage = await package.save();
      res.status(200).json({
        message: "Package updated successfully",
        package: updatedPackage,
      });
    }
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

/**
 * @api {delete} /packages/:id Delete a package by ID
 * @apiName deletePackage
 * @apiGroup Packages
 * @apiParam {String} id The ID of the package to delete
 * @apiSuccess {String} message Success message
 * @apiError {Object} 400 Bad Request - Invalid ID format
 * @apiError {Object} 404 Not Found - Package not found
 * @apiError {Object} 500 Server Error - Error deleting package
 */
exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid package ID format" });
    }

    // Find the package
    const package = await Package.findById(id);
    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Delete the package from the database
    await Package.findByIdAndDelete(id);

    res.status(200).json({
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({
      error: "Server error",
    });
  }
};
