const mongoose = require("mongoose");

const colors = require("colors");
const dbConnection = () => {
	mongoose
		.connect(process.env.DB_URI)
		.then((conn) => {
			console.log(`MongoDB connected: ${conn.connection.host}`.green);
		})
		.catch((err) => {
			console.log(`${err}`.red);
		});
};

module.exports = dbConnection;
