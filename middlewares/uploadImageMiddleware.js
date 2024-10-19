const multer = require("multer");
const { v4: uuid4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new ApiError(`Sorry, the file type ${file.mimetype.split("/")[1]} is not supported. Please upload a valid image only.`), false);
	}
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProfilePic = (imgField) => {
	return upload.single(imgField);
};

exports.resize = (fieldName, folderName) => {
	return asyncHandler(async (req, res, next) => {
		if (!req.file) return next();

		const ext = req.file.mimetype.split("/")[1];
		const fileName = `${fieldName}-${uuid4()}-${Date.now()}.${ext}`;

		await sharp(req.file.buffer).resize(100, 200).toFormat("jpeg").jpeg({ quality: 90 }).toFile(`uploads/${folderName}/${fileName}`);

		req.body[fieldName] = fileName;
		next();
	});
};
