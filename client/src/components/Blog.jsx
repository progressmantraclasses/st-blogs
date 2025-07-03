import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EditorState, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { stateToHTML } from 'draft-js-export-html';
import { useNavigate } from 'react-router-dom';
import { FaRegEdit, FaSignOutAlt, FaSignInAlt, FaInfoCircle, FaEnvelope, FaBars } from 'react-icons/fa';

// Ensure that axios automatically sends cookies with each request
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://shivam-blogs.onrender.com';  // Your backend URL

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);  // Toggle for mobile menu
    const navigate = useNavigate();

    // Check if the user is logged in by verifying cookies with backend API
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get('https://shivam-blogs.onrender.com/api/auth/check');
                setIsLoggedIn(true);
            } catch (err) {
                setIsLoggedIn(false);
            }
        };
        checkAuth();
    }, []);

    // Fetch all blogs
    useEffect(() => {
        axios.get('https://shivam-blogs.onrender.com/api/blogs/all')
            .then(res => {
                setBlogs(res.data); // Set all blogs from the response
            })
            .catch(err => console.error('Error fetching blogs:', err));
    }, []);

    // Render HTML content from Draft.js content state
    const renderHTMLContent = (content) => {
        try {
            const contentState = convertFromRaw(JSON.parse(content));
            return stateToHTML(contentState);
        } catch (error) {
            console.error('Error converting content:', error);
            return '<p>Error displaying content</p>';
        }
    };

    // Format the date to dd-mm-yyyy
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleLogout = async () => {
        try {
            await axios.post('https://shivam-blogs.onrender.com/api/logout');  // Log out via backend to clear cookie
            setIsLoggedIn(false);
            navigate('/'); // Redirect to home after logout
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    // Handle "Write Your Blog" click
    const handleWriteBlog = () => {
        if (isLoggedIn) {
            navigate('/blogs');
        } else {
            navigate('/login');  // Redirect to login if not logged in
        }
    };

    // Handle "Read Blog" click
    const handleReadBlog = (blogId) => {
        if (isLoggedIn) {
            navigate(`/blog/${blogId}`);  // Redirect to detailed blog page
        } else {
            navigate('/login');  // Redirect to login if not logged in
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col">
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
                        onClick={() => setMenuOpen(!menuOpen)} 
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
                            onClick={handleLogout}  // Call the handleLogout function
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
                {menuOpen && (
                    <div className="lg:hidden absolute top-16 left-0 w-full bg-gray-800 p-4 space-y-4">
                        <a href="/" className="block text-gray-300 hover:text-indigo-400 transition duration-300">Home</a>
                        <a href="/blogs" className="block text-gray-300 hover:text-indigo-400 transition duration-300">Your Blogs</a>
                        <a href="/dashboard" className="block text-gray-300 hover:text-indigo-400 transition duration-300">Dashboard</a>
                        <a href="/contact" className="block text-gray-300 hover:text-indigo-400 transition duration-300">Contact Us</a>

                        {/* Mobile Logout Button with Red Styling */}
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}  // Call the handleLogout function
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

            {/* Write Your Blog Button (Visible to all users) */}
            <div className="flex justify-center mt-6">
                <button onClick={handleWriteBlog} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition duration-300">
                    <FaRegEdit className="inline mr-2" /> Write Your Blog
                </button>
            </div>

            {/* Display Blogs */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8">
                {blogs.map((blog) => (
                    <div key={blog._id} className="bg-gray-800 p-5 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-2xl font-bold text-indigo-500">{blog.title}</h2>
                        <p className="text-sm text-gray-400 mt-1">By {blog.author} on {formatDate(blog.date || 'Invalid Date')}</p>

                        {blog.image && (
                            <img src={`https://shivam-blogs.onrender.com/${blog.image}`} alt="Blog" className="mt-3 w-full h-40 object-cover rounded-lg" />
                        )}

                        {/* Display only the first 2 lines of content */}
                        <div className="mt-3 text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: renderHTMLContent(blog.content).slice(0, 200) }}></div>

                        {/* Read More Button */}
                        <button onClick={() => handleReadBlog(blog._id)} className="mt-4 bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg text-white transition duration-300">
                            Read Blog
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 p-6 mt-auto">
                <div className="container mx-auto text-center text-gray-400">
                    <p>&copy; 2025 Blog Platform. All Rights Reserved.</p>
                    <div className="mt-4">
                        <a href="/about" className="text-indigo-400 hover:text-indigo-500 mx-2">About</a>
                        <a href="/contact" className="text-indigo-400 hover:text-indigo-500 mx-2">Contact</a>
                        <a href="/privacy" className="text-indigo-400 hover:text-indigo-500 mx-2">Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Blog;
