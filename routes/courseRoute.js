const express = require("express");
const {
	createCourse,
	getAllCourses,
	getCourse,
	updateCourse,
	deleteCourse,
	updateCourseAndAddVideos,
	buyCourse,
	removeCourse,
} = require("../controllers/courseController");
const authenticateToken = require("../middlewares/verifyToken");
const router = express.Router();

// Middleware to authenticate token
router.use(authenticateToken);

router.route("/").post(createCourse).get(getAllCourses);
router.route("/:id").get(getCourse).patch(updateCourse).delete(deleteCourse);
router.route("/upload/:id").patch(updateCourseAndAddVideos);
router.route("/:id/buy").post(buyCourse);
router.route("/:id/remove").delete(removeCourse);

module.exports = router;
