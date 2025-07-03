import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';


// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/blogs', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Blog Schema
const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    author: String,
    date: String
});

const Blog = mongoose.model('Blog', blogSchema);

// Multer for Image Uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes
app.post('/api/blogs', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const image = req.file ? req.file.path : '';
        const date = new Date().toDateString();
        
        const newBlog = new Blog({ title, content, image, author, date });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(5000, () => console.log('Server running on port 5000'));