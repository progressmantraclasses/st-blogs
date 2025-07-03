import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaBars, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state
  const navigate = useNavigate();

  // Axios config
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = 'https://shivam-blogs.onrender.com';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check token validity
        const res = await axios.get('/api/auth/check');
        setIsLoggedIn(true);
        
        // If logged in, fetch user data from /api/auth/user
        const userId = res.data.user.id; // Assuming the response contains user ID
        const userDataRes = await axios.get(`/api/auth/user`, {
          params: { id: userId }
        });
        setUser(userDataRes.data); // Assuming the response contains the full user data
      } catch (err) {
        console.error("Not logged in:", err.response?.data?.message || err.message);
        setIsLoggedIn(false);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout'); // Optional if you have logout endpoint
      Cookies.remove('token');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-5">
      {/* Header */}
      <nav className="w-full bg-gray-800 p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <h1
          className="text-2xl font-bold text-indigo-500 cursor-pointer hover:text-indigo-400 transition duration-300"
          onClick={() => navigate('/')}
        >
          Blog Platform
        </h1>

        {/* Hamburger Icon for Mobile */}
        <div className="lg:hidden flex items-center space-x-6">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
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

      {/* Dashboard Content */}
      <div className="mt-10">
        {isLoggedIn && user ? (
          <div className="max-w-2xl mx-auto bg-gray-800 p-5 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Welcome, {user.name || 'User'}!</h2>
            <div className="space-y-3">
              <p className="text-lg"><strong>Email:</strong> {user.email}</p>
              <p className="text-lg"><strong>Role:</strong> {user.role || 'N/A'}</p>
              <p className="text-lg"><strong>User ID:</strong> {user.id}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-400">
            You are not logged in. Please log in to view your dashboard.
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-center text-gray-400 py-4 mt-10">
        <p>© {new Date().getFullYear()} Blog Platform. All rights reserved.</p>
        <div className="mt-3">
          <a href="/about" className="hover:text-indigo-400 mx-2">About</a>
          <a href="/privacy" className="hover:text-indigo-400 mx-2">Privacy Policy</a>
          <a href="/terms" className="hover:text-indigo-400 mx-2">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
