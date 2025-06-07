const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

// init middleware
app.use(morgan("dev"));

// app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init database
require("./src/databases/init.mongodb.js");
// const {checkOverLoad} = require("./src/helpers/check.connect.js");
// checkOverLoad();

// init routes
app.use("/", require("./src/routes/index.js"));

// handle errors

module.exports = app;
