const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
};

/**
 * @desc Get All Users
 * @route GET /api/v1/users
 * @access Private
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find().select("-password -__v");
	const user = req.user;
	res.status(200).json({
		status: "success",
		pages: users.length,
		data: users,
	});
});

/**
 * @desc Get User By Id
 * @route GET /api/v1/users/:id
 * @access Private
 */
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new ApiError("User not found", 404));
	}
	res.status(200).json({
		status: "success",
		data: user,
	});
});

/**
 * @desc Update User By Id
 * @route Patch /api/v1/users/:id
 * @access Private
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
	if (!user) {
		return next(new ApiError("User not found", 404));
	}
	res.status(200).json({
		status: "success",
		data: user,
	});
});

/**
 * @desc Delete User By Id
 * @route Delete /api/v1/users/:id
 * @access Private
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);
	if (!user) {
		return next(new ApiError("User not found", 404));
	}
	res.status(200).json({
		status: "Deleted",
		data: user,
	});
});
