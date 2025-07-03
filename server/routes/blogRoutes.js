const express = require('express');
const Blog = require('../models/Blog');
const upload = require('../middleware/upload');
const Joi = require('joi');
const authMiddleware = require('../middleware/authMiddleware'); // Authentication middleware

const router = express.Router();

// Joi Validation Schema
const blogSchema = Joi.object({
    title: Joi.string().min(3).required(),
    content: Joi.string().min(10).required(),
    author: Joi.string().min(3).required()
});

// 🔹 GET: Fetch All Blogs (Only for logged-in users)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const blogs = await Blog.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/all', async (req, res) => {
    try {
        // Get all blogs (no filtering by user)
        const blogs = await Blog.find();
        res.json(blogs); // Return all blogs
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching blogs");
    }
});


// 🔹 POST: Create a New Blog (Only logged-in users)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    const { error } = blogSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const newBlog = new Blog({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            image: req.file ? req.file.path : null,
            userId: req.user.id // Associate blog with logged-in user
        });
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save blog' });
    }
});


// 🔹 DELETE: Remove a Blog (Only if the logged-in user owns it)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        
        if (blog.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete blog' });
    }
});

// 🔹 PUT: Update a Blog (Only if the logged-in user owns it)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        
        if (blog.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const { error } = blogSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        blog.title = req.body.title;
        blog.content = req.body.content;
        blog.author = req.body.author;
        if (req.file) blog.image = req.file.path;

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update blog' });
    }
});
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
