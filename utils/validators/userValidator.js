const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.registerValidator = [
	check("name").notEmpty().withMessage("name is required"),
	check("email").isEmail().withMessage("Please Type Valid Email"),
	check("password").isLength({ min: 4 }).withMessage("Password must be at least 4 characters long"),
	check("role").optional(),
	validatorMiddleware,
];
