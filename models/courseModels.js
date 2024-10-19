const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		minlength: 5,
		maxlength: 100,
	},
	description: {
		type: String,
		required: true,
		minlength: 20,
		maxlength: 2000,
	},
	instructor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User", // Reference to the User model (the instructor)
		required: true,
	},
	category: {
		type: String,
		required: true,
		enum: ["Development", "Business", "Design", "Marketing", "Health", "Music", "Other"], // Different course categories
	},
	content: [
		{
			title: {
				type: String,
				required: true,
			},
			videoUrl: {
				type: String,
				required: true,
			},
			duration: {
				type: Number, // Duration of the video in seconds
				required: true,
			},
		},
	],
	price: {
		type: Number,
		required: true,
		min: 0, // Price should be a non-negative number
	},
	createdAt: {
		type: Date,
		default: Date.now, // Date when the course was created
	},
	updatedAt: {
		type: Date,
		default: Date.now, // Date when the course was last updated
	},
	studentsEnrolled: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Reference to the User model (students enrolled in the course)
		},
	],
	rating: {
		type: Number,
		min: 0,
		max: 5,
		default: 0, // Initial rating set to 0
	},
	reviews: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User", // Reference to the User model (the reviewer)
			},
			comment: {
				type: String,
				required: true,
				minlength: 10,
				maxlength: 500,
			},
			rating: {
				type: Number,
				min: 1,
				max: 5,
				required: true,
			},
			createdAt: {
				type: Date,
				default: Date.now, // Date when the review was added
			},
		},
	],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
