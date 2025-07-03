import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSignOutAlt, FaSignInAlt, FaBars } from "react-icons/fa"; // For the header

axios.defaults.withCredentials = true;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://shivam-blogs.onrender.com/api/auth/login", { email, password });
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const requestOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post("https://shivam-blogs.onrender.com/api/auth/send-otp", { email });
      toast.success("OTP sent to your email!");
      setOtpSent(true);
      startTimer();
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    let countdown = 60;
    setTimer(countdown);
    setCanResend(false);
    const intervalId = setInterval(() => {
      countdown -= 1;
      setTimer(countdown);
      if (countdown <= 0) {
        clearInterval(intervalId);
        setCanResend(true);
      }
    }, 1000);
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://shivam-blogs.onrender.com/api/auth/verify-otp", { email, otp });
      toast.success("OTP Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `https://shivam-blogs.onrender.com/api/auth/${provider}`;
  };

  const handleOAuthCallback = () => {
    toast.success("Login successful!");
    navigate("/");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const user = urlParams.get("user");

    if (token && user) {
      handleOAuthCallback();
    }
  }, [navigate]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-gray-800 p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <h1
          className="text-2xl font-bold text-indigo-500 cursor-pointer hover:text-indigo-400 transition duration-300"
          onClick={() => navigate("/")}
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

          <button
            onClick={() => navigate("/login")}
            className="flex items-center text-gray-300 hover:text-indigo-400 transition duration-300"
          >
            <FaSignInAlt className="mr-2" />
            Login
          </button>
        </div>

        {/* Mobile Navigation Links */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 w-full bg-gray-800 p-4 space-y-4">
            <a href="/" className="block text-gray-300 hover:text-indigo-400 transition duration-300">Home</a>
            <a href="/blogs" className="block text-gray-300 hover:text-indigo-400 transition duration-300">Your Blogs</a>
            <a href="/dashboard" className="block text-gray-300 hover:text-indigo-400 transition duration-300">Dashboard</a>
            <a href="/contact" className="block text-gray-300 hover:text-indigo-400 transition duration-300">Contact Us</a>
          </div>
        )}
      </nav>

    <h2 className="text-3xl font-bold mb-4 text-center mt-10">{isOtpLogin ? "Login with OTP" : "Login"}</h2>


      {!isOtpLogin ? (
        <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 mx-auto">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 p-2 rounded">Login</button>
        </form>
      ) : (
        <form onSubmit={handleOtpLogin} className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 mx-auto">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            required
            disabled={otpSent}
          />
          {!otpSent ? (
            <button
              type="button"
              onClick={requestOtp}
              className={`w-full p-2 rounded ${isLoading ? "bg-gray-600" : "bg-green-500"}`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                required
              />
              <button type="submit" className="w-full bg-blue-500 p-2 rounded">Verify OTP</button>
              {timer > 0 && <p className="text-center mt-2 text-sm">Resend OTP in {timer} seconds</p>}
              {canResend && (
                <button
                  type="button"
                  onClick={requestOtp}
                  className="w-full mt-2 bg-yellow-500 p-2 rounded"
                >
                  Resend OTP
                </button>
              )}
            </>
          )}
        </form>
      )}

      <div className="flex gap-4 mt-4 justify-center">
        <button onClick={() => handleOAuthLogin("google")} className="bg-red-500 px-4 py-2 rounded">Google</button>
        <button onClick={() => handleOAuthLogin("github")} className="bg-gray-600 px-4 py-2 rounded">GitHub</button>
        <button onClick={() => handleOAuthLogin("linkedin")} className="bg-blue-700 px-4 py-2 rounded">LinkedIn</button>
      </div>

      {/* 🔁 Replaced button with Link */}
      <Link to="/forget-password" className="text-yellow-400 mt-4 block text-center">Forgot Password?</Link>

      <p className="mt-4 text-center">
        {isOtpLogin ? "Want to login with password?" : "Want to login with OTP?"}
        <button onClick={() => setIsOtpLogin(!isOtpLogin)} className="text-blue-400 ml-2">Switch</button>
      </p>

      <p className="mt-4 text-center">
        Don't have an account? <a href="/signup" className="text-blue-400">Sign Up</a>
      </p>

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

export default Login;
