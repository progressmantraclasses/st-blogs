import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaSignInAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://shivam-blogs.onrender.com'; // Your backend URL

const ContactUs = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Added state for mobile menu
    const navigate = useNavigate();

    // Check if the user is logged in by verifying cookies with backend API
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('/api/auth/check');
                setIsLoggedIn(true);
                setUserName(res.data.user.name); // Assuming the user data is returned
            } catch (err) {
                setIsLoggedIn(false);
                setUserName('');
            }
        };
        checkAuth();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('message', message);

        const formspreeEndpoint = 'https://formspree.io/f/mrgnrbrg'; // Replace with your Formspree ID

        try {
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
            });

            if (response.ok) {
                setStatus('success');
                alert('Thank you for contacting us!');
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setStatus('error');
                alert('Oops! Something went wrong.');
            }
        } catch (error) {
            setStatus('error');
            console.error('Error submitting the form:', error);
            alert('Oops! Something went wrong.');
        }
    };

    // Handle Logout
    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');  // Logout via backend
            setIsLoggedIn(false);
            navigate('/');  // Redirect to homepage after logout
        } catch (err) {
            console.error('Logout failed:', err);
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
                            onClick={handleLogout}  // Trigger the handleLogout function
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
                                onClick={handleLogout}  // Trigger the handleLogout function
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

            {/* Contact Form Section */}
            <div className="mt-10 px-4 md:px-8 flex justify-center">
                <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-xl">
                    <h2 className="text-3xl font-bold text-indigo-500 text-center">Contact Us</h2>
                    <p className="text-sm text-gray-400 mt-2 text-center">We'd love to hear from you! Please fill out the form below.</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows="6"
                                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg transition duration-300"
                        >
                            Submit
                        </button>
                    </form>

                    {/* Success/Error Status */}
                    {status === 'success' && (
                        <p className="mt-4 text-green-500 text-center">Your message has been sent successfully!</p>
                    )}
                    {status === 'error' && (
                        <p className="mt-4 text-red-500 text-center">There was an error. Please try again.</p>
                    )}
                </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-16 px-4 md:px-8 text-center">
                <h3 className="text-2xl font-bold text-indigo-500">Follow Us</h3>
                <div className="mt-6 flex justify-center space-x-8">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-3xl text-gray-400 hover:text-indigo-500 transition duration-300"
                    >
                        <FaFacebook />
                    </a>
                    <a
                        href="https://x.com/ShivamT130"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-3xl text-gray-400 hover:text-indigo-500 transition duration-300"
                    >
                        <FaTwitter />
                    </a>
                    <a
                        href="https://www.instagram.com/the.shivam_tiwari"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-3xl text-gray-400 hover:text-indigo-500 transition duration-300"
                    >
                        <FaInstagram />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/shivamtiwari13/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-3xl text-gray-400 hover:text-indigo-500 transition duration-300"
                    >
                        <FaLinkedin />
                    </a>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 p-6 mt-16">
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

export default ContactUs;
