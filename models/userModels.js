const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		role: {
			type: String,
			enum: ["user", "admin", "Teacher"],
			default: "user",
		},
		avatar: {
			type: String,
			default: "default.jpg",
		},
		courses: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Course",
			},
		],
	},
	{ timestamps: true }
);

userSchema.post("init", (doc) => {
	if (doc.avatar) {
		const avatarUrl = `${process.env.BASE_URL}/profiles/${doc.avatar}`;
		doc.avatar = avatarUrl;
	}
});

userSchema.post("save", (doc) => {
	if (doc.avatar) {
		const avatarUrl = `${process.env.BASE_URL}/profiles/${doc.avatar}`;
		doc.avatar = avatarUrl;
	}
});

module.exports = mongoose.model("User", userSchema);
