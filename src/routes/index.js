'use strict'

const express = require('express');
const router = express.Router();

router.use('/v1/api', require('./access'));

router.get("/", (req, res, next) => {
    const strCompress = "hello world";
    return res.status(200).json({
    message: "Welcome to WSV eCommerce API",
  });
});

module.exports = router;