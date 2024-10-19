const asyncHandler = require("express-async-handler");
const Course = require("../models/courseModels");
const User = require("../models/userModels");
const ApiError = require("../utils/apiError");

/**
 * @desc Create Course
 * @route Post /api/v1/course
 * @access Private
 */

exports.createCourse = asyncHandler(async (req, res, next) => {
	const { title, description, duration, instructor, category, studentsEnrolled, createdAt, videos, price } = req.body;

	const instructorId = req.user._id;
	const content = videos.map((video) => ({
		title: video.originalname,
		videoUrl: video.videoUrl,
		duration: video.duration,
	}));

	const course = await Course.create({
		title,
		description,
		category,
		duration,
		content,
		instructor: instructorId,
		studentsEnrolled,
		createdAt,
		price,
	});
	res.status(201).json({
		status: "success",
		data: course,
	});
});

/**
 * @desc Updates The Course And Add Videos
 * @route Patch /api/v1/course
 * @access Privet
 */

exports.updateCourseAndAddVideos = asyncHandler(async (req, res, next) => {
	const { videos } = req.body;
	const updatedCourse = await Course.findByIdAndUpdate(
		req.params.id,
		{ $push: { content: { $each: videos.map((video) => ({ title: video.originalname, videoUrl: video.videoUrl, duration: video.duration })) } } },
		{ new: true }
	);
	if (!updatedCourse) {
		return next(new ApiError("Course not found", 404));
	}

	res.status(201).json({
		status: "success",
		data: updatedCourse,
	});
});

/**
 * @desc Get All Courses
 * @route Get /api/v1/course
 * @access public
 */

exports.getAllCourses = asyncHandler(async (req, res, next) => {
	const courses = await Course.find();

	if (courses == 0) {
		return res.status(200).json({
			message: "No courses found",
		});
	} else {
		res.status(200).json({
			page: courses.length,
			status: "success",
			data: courses,
		});
	}
});

exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);
	if (!course) {
		return next(new ApiError("Course not found", 404));
	}
	res.status(200).json({
		status: "success",
		data: course,
	});
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
	if (!course) {
		return next(new ApiError("Course not found", 404));
	}
	res.status(200).json({
		status: "success",
		data: course,
	});
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findByIdAndDelete(req.params.id);
	if (!course) {
		return next(new ApiError("Course not found", 404));
	}
	res.status(200).json({
		status: "success",
		message: "Course deleted successfully",
	});
});

exports.buyCourse = asyncHandler(async (req, res, next) => {
	const studentId = req.user._id;
	const course = await Course.findById(req.params.id);
	if (!course) {
		return next(new ApiError("Course not found", 404));
	}

	if (course.studentsEnrolled.includes(studentId)) {
		return next(new ApiError("You have already purchased this course", 400));
	}
	await Course.findByIdAndUpdate(req.params.id, { $push: { studentsEnrolled: studentId } }, { new: true });
	await User.findByIdAndUpdate(studentId, { $push: { courses: studentId } }, { new: true });
	if (!course) {
		return next(new ApiError("Course not found", 404));
	}
	res.status(200).json({
		status: "success",
		data: course,
	});
});

exports.removeCourse = asyncHandler(async (req, res, next) => {
	const studentId = req.user._id;
	const course = await Course.findByIdAndUpdate(req.params.id, { $pull: { studentsEnrolled: studentId } }, { new: true });
	const user = await User.findByIdAndUpdate(studentId, { $pull: { courses: studentId } }, { new: true });
	if (!course) {
		return next(new ApiError("Course not found", 404));
	}
	res.status(200).json({
		status: "success",
		data: course,
		user,
	});
});
