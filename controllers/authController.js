const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { v4: uuid4 } = require("uuid");
const sharp = require("sharp");
// Generate Token
const generateToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// const multerStorage = multer.memoryStorage();

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// exports.uploadProfilePic = upload.single("avatar");

// exports.resize = asyncHandler(async (req, res, next) => {
// 	const ext = req.file.mimetype.split("/")[1];
// 	const fileName = `avatar-${uuid4()}${Date.now()}.${ext}`;
// 	await sharp(req.file.buffer).resize(100, 200).toFormat("jpeg").jpeg({ quality: 90 }).toFile(`uploads/profiles/${fileName}`);
// 	req.body.avatar = fileName;
// 	next();
// });

/**
 * @description Create a new user
 * @route POST /api/v1/users
 * @access Public
 */
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role, avatar } = req.body;

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return next(new ApiError("Email already exists", 400));
	}
	const passwordHash = await bcrypt.hash(password, 12);

	const user = await User.create({
		name,
		email,
		password: passwordHash,
		role,
		avatar,
	});

	const token = generateToken({ id: user._id });

	res.status(201).json({
		status: "success",
		data: user,
		token,
	});
});

/**
 * @description Login
 * @route Delete /api/v1/login
 * @access public
 */
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ApiError("Please fill all required fields", 400));
	}
	const userRegistered = await User.findOne({ email });
	if (!userRegistered) {
		return next(new ApiError("Invalid email or password", 401));
	}
	const isMatch = await bcrypt.compare(password, userRegistered.password);
	if (!isMatch) {
		return next(new ApiError("Invalid email or password", 401));
	}
	const token = generateToken({ id: userRegistered._id });
	res.status(200).json({
		status: "success",
		data: userRegistered,
		token,
	});
});
