const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/",
  // upload.single("banner_image"),
  authMiddleware,
  authorizeRole("admin"),
  bannerController.createBanner
);

router.put(
  "/:banner_id",
  upload.single("banner_image"),
  authMiddleware,
  authorizeRole("admin"),
  bannerController.updateBanner
);

router.delete(
  "/:banner_id",
  authMiddleware,
  authorizeRole("admin"),
  bannerController.deleteBanner
);

router.get("/", bannerController.getBanners);

module.exports = router;
