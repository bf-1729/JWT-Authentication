const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    try {
        // Get token from the header
        const token = req.header("x-token");
        
        // Check if token is provided
        if (!token) {
            return res.status(401).send("Access denied. No token provided.");
        }

        // Verify token
        const decoded = jwt.verify(token, "jwtSecret");
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).send("Invalid token.");
    }
};
