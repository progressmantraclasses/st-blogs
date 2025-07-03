import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { stateToHTML } from 'draft-js-export-html';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

// Ensure that axios automatically sends cookies with each request
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://shivam-blogs.onrender.com'; // Your backend URL

const Blogs = () => {
    const [title, setTitle] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [author, setAuthor] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [editingBlog, setEditingBlog] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get('/api/auth/check');
                setIsLoggedIn(true);
            } catch (err) {
                setIsLoggedIn(false);
                navigate('/login');
            }
        };
        checkAuth();
    }, [navigate]);

    // Fetch all blogs if the user is logged in
    useEffect(() => {
        if (isLoggedIn) {
            axios.get('/api/blogs')
                .then(res => setBlogs(res.data))
                .catch(err => console.error('Error fetching blogs:', err));
        }
    }, [isLoggedIn]);

    // Handle Image Upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    // Handle Blog Submission (New & Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const rawContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', rawContent);
        formData.append('author', author);
        if (image) formData.append('image', image);

        try {
            if (editingBlog) {
                await axios.put(`/api/blogs/${editingBlog._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setBlogs(blogs.map(blog => blog._id === editingBlog._id ? { ...blog, title, content: rawContent, author, image } : blog));
                resetForm();
            } else {
                const res = await axios.post('/api/blogs', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setBlogs([res.data, ...blogs]);
                resetForm();
            }
        } catch (err) {
            console.error('Error submitting blog:', err);
        }
    };

    // Reset Form
    const resetForm = () => {
        setTitle('');
        setEditorState(EditorState.createEmpty());
        setAuthor('');
        setImage(null);
        setPreview(null);
        setEditingBlog(null); // Ensure we clear editing state
    };

    // Delete Blog
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/blogs/${id}`);
            setBlogs(blogs.filter(blog => blog._id !== id));
        } catch (err) {
            console.error('Error deleting blog:', err);
        }
    };

    const renderHTMLContent = (content) => {
        try {
            const contentState = convertFromRaw(JSON.parse(content));
            return stateToHTML(contentState);
        } catch (error) {
            console.error('Error converting content:', error);
            return '<p>Error displaying content</p>';
        }
    };

    // Edit Blog
    const handleEdit = (blog) => {
        setTitle(blog.title);
        setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(blog.content))));
        setAuthor(blog.author);
        setEditingBlog(blog);
        setPreview(blog.image ? `https://shivam-blogs.onrender.com/${blog.image}` : null); // Set image preview on edit
    };

    // Handle Text Formatting
    const handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const toggleInlineStyle = (style) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout'); // Log out via backend to clear cookie
            setIsLoggedIn(false);
            navigate('/'); // Redirect to home after logout
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-5">
            {/* Navbar */}
            <nav className="w-full bg-gray-800 p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
                <h1
                    className="text-2xl font-bold text-indigo-500 cursor-pointer hover:text-indigo-400 transition duration-300"
                    onClick={() => navigate('/')}
                >
                    Blog Platform
                </h1>

                {/* Hamburger Icon for Mobile */}
                <div className="lg:hidden flex items-center space-x-6">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="text-white focus:outline-none"
                    >
                        <FaBars className="text-2xl" />
                    </button>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center space-x-6">
                    <a href="/" className="text-gray-300 hover:text-indigo-400 transition duration-300">Home</a>
                    <a href="/blogs" className="text-gray-300 hover:text-indigo-400 transition duration-300">Your Blogs</a>
                    <a href="/dashboard" className="text-gray-300 hover:text-indigo-400 transition duration-300">Dashboard</a>
                    <a href="/contact" className="text-gray-300 hover:text-indigo-400 transition duration-300">Contact Us</a>
                    
                    {/* Logout Button with Red Styling */}
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-300"
                        >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center text-gray-300 hover:text-indigo-400 transition duration-300"
                        >
                            <FaSignInAlt className="mr-2" />
                            Login
                        </button>
                    )}
                </div>

                {/* Mobile Navigation Links */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-16 left-0 w-full bg-gray-800 p-4 space-y-4">
                        <a href="/" className="block text-gray-300 hover:text-indigo-400 transition duration-300">Home</a>
                        <a href="/blogs" className="block text-gray-300 hover:text-indigo-400 transition duration-300">Your Blogs</a>
                        <a href="/dashboard" className="block text-gray-300 hover:text-indigo-400 transition duration-300">Dashboard</a>
                        <a href="/contact" className="block text-gray-300 hover:text-indigo-400 transition duration-300">Contact Us</a>
                        
                        {/* Mobile Logout Button with Red Styling */}
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="block text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-300"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="block text-gray-300 hover:text-indigo-400 transition duration-300"
                            >
                                Login
                            </button>
                        )}
                    </div>
                )}
            </nav>

            {/* Blog Creation Form */}
            {isLoggedIn && (
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-10 bg-gray-800 p-5 rounded-lg shadow-md">
                    <input
                        type="text"
                        className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none"
                        placeholder="Blog Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />

                    {/* Formatting Buttons */}
                    <div className="bg-gray-700 p-3 rounded-lg mb-4">
                        <button type="button" className="bg-blue-500 px-4 py-2 rounded mx-2" onClick={() => toggleInlineStyle('BOLD')}>Bold</button>
                        <button type="button" className="bg-green-500 px-4 py-2 rounded mx-2" onClick={() => toggleInlineStyle('ITALIC')}>Italic</button>
                        <button type="button" className="bg-red-500 px-4 py-2 rounded mx-2" onClick={() => toggleInlineStyle('UNDERLINE')}>Underline</button>
                        <button type="button" className="bg-yellow-500 px-4 py-2 rounded mx-2" onClick={() => toggleInlineStyle('STRIKETHROUGH')}>Strikethrough</button>
                    </div>

                    {/* Editor */}
                    <div className="bg-gray-700 text-white p-3 rounded-lg mb-4">
                        <Editor editorState={editorState} onChange={setEditorState} handleKeyCommand={handleKeyCommand} />
                    </div>

                    {/* Author Input */}
                    <input
                        type="text"
                        className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none mb-4"
                        placeholder="Author Name"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                    />

                    {/* Image Upload */}
                    <input 
                        type="file" 
                        className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg" 
                        onChange={handleImageChange} 
                    />

                    {/* Preview Image */}
                    {preview && <img src={preview} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-lg mb-4" />}

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-blue-500 p-3 rounded-lg">{editingBlog ? "Update Blog" : "Submit Blog"}</button>
                </form>
            )}

            {/* Display Blogs */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <div key={blog._id} className="bg-gray-800 p-5 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-3">{blog.title}</h2>
                        <p className="text-sm text-gray-400">By {blog.author} on {blog.date || 'Unknown Date'}</p>
                        {blog.image && <img src={`https://shivam-blogs.onrender.com/${blog.image}`} alt="Blog" className="mt-3 w-full h-40 object-cover rounded-lg" />}
                        <div className="mt-3 text-white" dangerouslySetInnerHTML={{ __html: renderHTMLContent(blog.content) }}></div>
                        
                        <div className="mt-4 flex justify-between">
                            <button className="bg-green-500 px-4 py-2 rounded" onClick={() => handleEdit(blog)}>Edit</button>
                            <button className="bg-red-500 px-4 py-2 rounded" onClick={() => handleDelete(blog._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blogs;
