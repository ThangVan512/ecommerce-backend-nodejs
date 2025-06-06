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
// init database

// init routes
app.get("/", (req, res, next) => {
    const strCompress = "hello world";
    return res.status(200).json({
    message: "Welcome to WSV eCommerce API",
  });
});

// handle errors

module.exports = app;
