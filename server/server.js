// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const blogRoutes = require('./routes/blogRoutes');
// const cookieParser = require("cookie-parser");
// const authRoutes = require("./routes/authRoutes");
// const passportSetup = require("./config/passportSetup");



// const app = express();

// // Middleware

// app.use(express.json());
// app.use(cors({ origin: "https://st-blogs.vercel.app", credentials: true }));
// app.use(cookieParser());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/blogs', blogRoutes);
// app.use("/api/auth", authRoutes);



// // Database Connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('✅ MongoDB Connected'))
//     .catch(err => console.error('❌ MongoDB Connection Error:', err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const blogRoutes = require('./routes/blogRoutes');
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const passportSetup = require("./config/passportSetup");
const jwt = require('jsonwebtoken');

const app = express();

// Middleware

app.use(express.json());

// CORS configuration (allow credentials and specify frontend URL)
app.use(cors({ 
  origin: "https://st-blogs.vercel.app", // Your frontend URL
  credentials: true,  // Allow cookies to be sent/received
}));

app.use(cookieParser());  // Parse cookies from the request

// Static file serving (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JWT Authentication Middleware (for protected routes)
// JWT Authentication middleware example
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Read token from cookies

  if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info to the request
      next(); // Allow the request to proceed
  } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
  }
};



// Routes
app.use('/api/blogs', blogRoutes);
app.use("/api/auth", authRoutes);

// Example of a protected route (for testing)
// Backend route to check authentication
app.get('/api/auth/check', authMiddleware, (req, res) => {
  res.json({ message: 'Authenticated', user: req.user });
});

// app.get("/api/auth/user", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     res.status(500).json({ message: "Error fetching user data" });
//   }
// });



// Logout Route
// Logout Route
app.post("/api/logout", (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });
  res.json({ message: "Logged out successfully" });
});




// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
