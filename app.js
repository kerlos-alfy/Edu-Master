const path = require("path");

const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const dbConnection = require("./config/dbConnection");
const ApiError = require("./utils/apiError");
const globeError = require("./middlewares/errorMiddleware");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const courseRoute = require("./routes/courseRoute");

dbConnection();

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
	app.use(require("morgan")("dev"));
}
app.use("/api/v1", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/course", courseRoute);

app.all("*", (req, res, next) => {
	next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globeError);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
