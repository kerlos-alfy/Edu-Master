const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const asyncHandler = require("express-async-handler");

const authenticateToken = asyncHandler(async (req, res, next) => {
	const token = req.headers["authorization"]?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Token required" });
	}

	// Verify the token
	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	// Retrieve user information from the database using the user ID from the token
	const userLogging = await User.findById(decoded.id);
	if (!userLogging) {
		return res.status(404).json({ message: "User not found" });
	}

	// Place user information in the request object
	req.user = userLogging;
	next();
});

module.exports = authenticateToken;
