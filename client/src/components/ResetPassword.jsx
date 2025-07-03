import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode"; // Ensure you installed it with: npm install jwt-decode
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icons for show/hide password

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState(""); // Extracted from the token

  useEffect(() => {
    // Decode token and extract email
    try {
      const decoded = jwtDecode(token);
      setEmail(decoded.email);
    } catch (error) {
      toast.error("Invalid or expired token.");
      navigate("/login"); // Redirect if token is invalid
    }
  }, [token, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
    }

    try {
        const res = await axios.post(`https://shivam-blogs.onrender.com/api/auth/reset-password/${token}`, {
            newPassword: password,
        });

        toast.success(res.data.message || "Password reset successful!");
        navigate("/login");
    } catch (err) {
        toast.error(err.response?.data?.message || "Password reset failed");
    }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-4">Reset Password</h2>

      <form onSubmit={handleResetPassword} className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <p className="text-gray-400 text-sm mb-3">Resetting password for: {email}</p>

        {/* New Password Input */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-300"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="relative mb-3">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2 text-gray-300"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button type="submit" className="w-full bg-blue-500 p-2 rounded">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
