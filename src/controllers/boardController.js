const Board = require("../models/boardModel");

// Create a new board
exports.createBoard = async (req, res) => {
  const { name, description} = req.body;

  try {
    const board = new Board({
      name,
      description,
    });

    const savedBoard = await board.save();
    res.status(201).json({ message: "Board created successfully", board: savedBoard });
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ error: "Failed to create board" });
  }
};

// Get all boards
exports.getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
};

// Get a single board by ID
exports.getBoardById = async (req, res) => {
  const { id } = req.params;

  try {
    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.status(200).json(board);
  } catch (error) {
    console.error("Error fetching board:", error);
    res.status(500).json({ error: "Failed to fetch board" });
  }
};

// Update a board
exports.updateBoard = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { name, description},
      { new: true, runValidators: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.status(200).json({ message: "Board updated successfully", board: updatedBoard });
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ error: "Failed to update board" });
  }
};

// Delete a board
exports.deleteBoard = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBoard = await Board.findByIdAndDelete(id);
    if (!deletedBoard) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ error: "Failed to delete board" });
  }
};
