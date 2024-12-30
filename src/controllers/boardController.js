const Board = require("../models/boardModel");
const Class = require('../models/classModel');
const Subject = require('../models/subjectModel');

// Create a new board
exports.createBoard = async (req, res) => {
  const { name, description,icon} = req.body;

  try {
    const board = new Board({
      name,
      description,
      icon
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



// Delete a board and cascade delete related classes and subjects
exports.deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id;

    // First, find the board to make sure it exists
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Find all classes associated with this board
    const classes = await Class.find({ curriculum: boardId });

    // If classes are found, delete all subjects associated with those classes
    if (classes.length > 0) {
      const classIds = classes.map(cls => cls._id);

      // Delete subjects related to the classes
      await Subject.deleteMany({ class_id: { $in: classIds } });
    }

    // Now delete the classes associated with the board
    await Class.deleteMany({ curriculum: boardId });

    // Finally, delete the board
    await Board.findByIdAndDelete(boardId);

    return res.status(200).json({ message: 'Board and its related classes and subjects deleted successfully' });

  } catch (error) {
    console.error('Error deleting board:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
