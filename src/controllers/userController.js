// src/controllers/userController.js
const User = require("../models/userModel");

exports.getProfile = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    let user = await User.findOne({ auth_id: firebaseUid });

    if (!user) {
      user = new User({
        auth_id: firebaseUid,
        email: req.user.email || null,
        name: req.user.name || "New User",
        role: "student", 
        date_joined: new Date(),
      });
      await user.save();
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};


/**
 * Controller to get user details by auth_id from headers.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserByAuthId = async (req, res) => {
  try {
    const authId = req.headers['auth_id']; // Extract auth_id from headers

    if (!authId) {
      return res.status(400).json({ message: 'auth_id header is required' });
    }

    // Find user by auth_id
    const user = await User.findOne({ auth_id: authId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    console.error('Error fetching user by auth_id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUserByAuthId = async (req, res) => {
  try {
    const auth_id = req.headers['auth_id'];

    if (!auth_id) {
      return res.status(400).json({ message: "auth_id is required." });
    }

    // Extract fields from request body
    const updateData = { ...req.body };

    // If password is being updated, hash it before saving
    // if (updateData.password) {
    //   const saltRounds = 10;
    //   const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
    //   updateData.password = hashedPassword;
    // }

    // Remove fields that should not be updated via this endpoint
    // For example, role, access_token, refresh_token, etc.
    const immutableFields = ["role","password", "access_token", "refresh_token", "fcmToken", "approval_status", "date_joined", "auth_id"];
    immutableFields.forEach(field => delete updateData[field]);

    // Update the user document based on auth_id
    const updatedUser = await User.findOneAndUpdate(
      { auth_id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -access_token -refresh_token"); // Exclude sensitive fields

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error while updating user." });
  }
};