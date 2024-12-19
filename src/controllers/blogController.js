// controllers/BlogController.js

const Blog = require('../models/blogModel');

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Public
exports.createBlog = async (req, res) => {
  try {
    const { title, image, description, author, tags, status } = req.body;

    // Validate required fields
    if (!title || !image || !description || !author) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, image URL, description, and author',
      });
    }

    const blog = await Blog.create({
      title,
      image,
      description,
      author,
      tags,
      status,
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message,
    });
  }
};

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message,
    });
  }
};

// @desc    Get a single blog post by ID
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message,
    });
  }
};

// @desc    Update a blog post by ID
// @route   PUT /api/blogs/:id
// @access  Public
exports.updateBlog = async (req, res) => {
  try {
    const { title, image, description, author, tags, status } = req.body;

    // Find the blog post by ID
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }

    // Update fields if they are provided in the request body
    blog.title = title || blog.title;
    blog.image = image || blog.image;
    blog.description = description || blog.description;
    blog.author = author || blog.author;
    blog.tags = tags || blog.tags;
    blog.status = status || blog.status;

    // Save the updated blog post
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message,
    });
  }
};

// @desc    Delete a blog post by ID
// @route   DELETE /api/blogs/:id
// @access  Public
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message,
    });
  }
};
