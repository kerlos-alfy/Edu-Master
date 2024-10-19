const express = require("express");
const { registerValidator } = require("../utils/validators/userValidator");
const { login, register } = require("../controllers/authController");
const { uploadProfilePic, resize } = require("../middlewares/uploadImageMiddleware");

const router = express.Router();

router.route("/login").post(login);

router.route("/register").post(uploadProfilePic("avatar"), resize("avatar", "profiles"), registerValidator, register);

module.exports = router;

// "avatar"
