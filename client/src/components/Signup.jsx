import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaSignInAlt, FaBars } from 'react-icons/fa';

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step to control form display
  const [timer, setTimer] = useState(0); // Countdown timer for resend OTP
  const [canResend, setCanResend] = useState(false); // Flag to control resend button visibility
  const [isLoading, setIsLoading] = useState(false); // Flag for loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();

  // Check if the user is logged in by verifying cookies with backend API
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('/api/auth/check');
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // Handle form submission for Signup (Step 1)
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      await axios.post("https://shivam-blogs.onrender.com/api/auth/signup", form);
      toast.info("OTP sent to your email");
      setStep(2); // Move to OTP verification step
      startTimer(); // Start the countdown timer
    } catch (err) {
      toast.error(err.response.data.message || "Signup failed");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Start countdown timer for OTP resend
  const startTimer = () => {
    let countdown = 60; // 1 minute countdown
    setTimer(countdown);
    setCanResend(false); // Disable resend initially

    const intervalId = setInterval(() => {
      countdown -= 1;
      setTimer(countdown);
      if (countdown <= 0) {
        clearInterval(intervalId); // Stop the timer when it reaches 0
        setCanResend(true); // Enable resend OTP button
      }
    }, 1000); // Update every second
  };

  // Handle OTP verification (Step 2)
  const verifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const res = await axios.post("https://shivam-blogs.onrender.com/api/auth/verify-signup-otp", { email: form.email, otp });
      
      // Save the token to localStorage after OTP verification
      localStorage.setItem("token", res.data.token);

      toast.success("Signup and Login successful!");
      navigate("/"); // Redirect to home after successful signup
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Handle OTP resend
  const resendOtp = async () => {
    setIsLoading(true); // Show loading state
    try {
      await axios.post("https://shivam-blogs.onrender.com/api/auth/send-otp", { email: form.email });
      toast.info("OTP resent to your email");
      setTimer(60); // Reset timer to 60 seconds
      setCanResend(false); // Disable resend button again
      startTimer(); // Restart countdown
    } catch (err) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');  // Log out via backend to clear cookie
      setIsLoggedIn(false);
      navigate('/'); // Redirect to home after logout
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
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

      {/* Signup Form */}
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h2 className="text-3xl font-bold mb-4">{step === 1 ? "Sign Up" : "Verify OTP"}</h2>

        {/* Step 1: Sign Up Form */}
        {step === 1 ? (
          <form onSubmit={handleSignup} className="bg-gray-800 p-6 rounded-lg w-80">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
              required
            />
            <button
              type="submit"
              className={`w-full bg-green-500 p-2 rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          // Step 2: OTP Verification Form
          <div className="bg-gray-800 p-6 rounded-lg w-80">
            <form onSubmit={verifyOtp}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                required
              />
              <button type="submit" className="w-full bg-blue-500 p-2 rounded">Verify OTP</button>
            </form>

            {/* Timer Display */}
            <div className="text-center mt-2">
              {timer > 0 ? (
                <p className="text-sm text-gray-400">Resend OTP in {timer} seconds</p>
              ) : (
                <button
                  type="button"
                  onClick={resendOtp}
                  className="w-full bg-yellow-500 p-2 rounded mt-2"
                  disabled={!canResend || isLoading}
                >
                  {isLoading ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>
          </div>
        )}
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

export default Signup;
