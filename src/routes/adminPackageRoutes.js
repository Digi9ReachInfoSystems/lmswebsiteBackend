const express = require("express");
const router = express.Router();
const adminPackageController = require("../controllers/packagesController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/createPackage",
  authMiddleware,
  upload.single("image"),
  authorizeRole("admin"),
  adminPackageController.createPackage
);

router.get(
  "/getPackages/:class_id/:mode",
  // authMiddleware,
  adminPackageController.getPackagesByClass
);

router.get(
  "/getAllPackages",
  authMiddleware,
  authorizeRole("admin"),
  adminPackageController.getAllPackages
);

router.delete(
  "/packages/:id",
  authMiddleware,
  authorizeRole("admin"),
  adminPackageController.deletePackage
);
router.put(
  "/updatePackages/:id",
  authMiddleware,
  authorizeRole("admin"),
  upload.single("image"),
  adminPackageController.updatePackage
);
router.get("/getPackageById/single/:id", adminPackageController.getPackageById);

module.exports = router;
