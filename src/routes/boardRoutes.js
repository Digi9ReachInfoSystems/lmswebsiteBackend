const express = require("express");
const {
  createBoard,
  getAllBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");
const authMiddleware = require("../middlewares/authMiddleware"); // Assuming an authentication middleware

const router = express.Router();

// Protect all routes with auth middleware
// router.use(authMiddleware);

router.post("/", createBoard); // Create a new board
router.get("/", getAllBoards); // Get all boards for the logged-in user
router.get("/:id", getBoardById); // Get a single board by ID
router.put("/:id", updateBoard); // Update a board
router.delete("/:id", deleteBoard); // Delete a board

module.exports = router;
