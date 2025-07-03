// src/pages/ForgotPassword.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

axios.defaults.withCredentials = true;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [lastSentEmail, setLastSentEmail] = useState("");
  const [resetTimer, setResetTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [showSuccessBox, setShowSuccessBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    const storedTime = localStorage.getItem("resetTimestamp");

    if (storedEmail && storedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(storedTime)) / 1000);
      const remaining = 60 - elapsed;

      if (remaining > 0) {
        setLastSentEmail(storedEmail);
        setEmail(storedEmail);
        setShowSuccessBox(true);
        setCanResend(false);
        setResetTimer(remaining);

        const interval = setInterval(() => {
          setResetTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setCanResend(true);
              localStorage.removeItem("resetEmail");
              localStorage.removeItem("resetTimestamp");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetTimestamp");
      }
    }
  }, []);

  const startResetTimer = () => {
    const count = 60;
    setResetTimer(count);
    setCanResend(false);
    localStorage.setItem("resetEmail", email);
    localStorage.setItem("resetTimestamp", Date.now().toString());

    const interval = setInterval(() => {
      setResetTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          localStorage.removeItem("resetEmail");
          localStorage.removeItem("resetTimestamp");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    try {
      setErrorMessage(""); // clear previous error
      await axios.post("https://shivam-blogs.onrender.com/api/auth/forgot-password", { email });
      setShowSuccessBox(true);
      setLastSentEmail(email);
      startResetTimer();
      toast.success("Reset link sent successfully!");
    } catch (err) {
      console.error("Forgot password error:", err);

      const message =
        err?.response?.data?.message ||
        "Account not found. Please check your email and try again.";

      setErrorMessage(message);         // for inline display
      toast.error(message);             // toast fallback
    }
  };

  const isSameEmail = email.trim().toLowerCase() === lastSentEmail.trim().toLowerCase();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <ToastContainer position="top-center" autoClose={3000} />

        {!showSuccessBox ? (
          <>
            <h2 className="text-3xl font-semibold mb-6 text-center">Reset Your Password 🔐</h2>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(""); // clear error on change
              }}
              className="w-full p-3 mb-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errorMessage && (
              <p className="text-red-400 text-sm mb-3">{errorMessage}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!email || (isSameEmail && !canResend)}
              className={`w-full p-3 rounded font-semibold transition duration-300 ${
                (!isSameEmail || canResend)
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              {!isSameEmail || canResend ? "Send Reset Link" : `Resend in ${resetTimer}s`}
            </button>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-blue-400 hover:underline">
                🔙 Back to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">✅ Email Sent!</h3>
              <p className="mb-4">
                A password reset link has been sent to <strong>{lastSentEmail}</strong>.
                <br />
                Please check your inbox or spam folder.
              </p>

              <button
                onClick={() => {
                  setShowSuccessBox(false);
                }}
                className="w-full mb-3 p-3 rounded bg-red-500 hover:bg-red-600 transition font-semibold"
              >
                Edit Email
              </button>

              <Link
                to="/login"
                className="block w-full text-center p-3 rounded bg-blue-500 hover:bg-blue-600 transition font-semibold text-white"
              >
                Go to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
