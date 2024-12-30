// routes/BlogRoute.js

const express = require('express');
const router = express.Router();
const BlogController = require('../controllers/blogController');
const { route } = require('./blogRoutes');

// Route: /api/blogs

router.post('/create', BlogController.createBlog);
router.get('/all', BlogController.getBlogs);
router.get('/single/:id', BlogController.getBlogById);
router.put('/update/:id', BlogController.updateBlog);
router.delete('/delete/:id', BlogController.deleteBlog);
module.exports = router;
