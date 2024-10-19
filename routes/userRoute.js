const express = require("express");

const { getAllUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const authenticateToken = require("../middlewares/verifyToken");

const router = express.Router();

router.route("/").get(authenticateToken, getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
