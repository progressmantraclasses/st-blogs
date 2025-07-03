const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    // Get token from cookies
    const token = req.cookies.token; // The token should be sent in cookies

    if (!token) {
        return res.status(401).json({ message: "No Token, Authorization Denied" });
    }

    try {
        // Verify the token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to request object
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

module.exports = protect;
