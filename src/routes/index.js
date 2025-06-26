'use strict'

const express = require('express');
const router = express.Router();
const { apiKey, permissions } = require('../auths/checkAuth');
const accessRouter = require('./access');


// check apiKey
router.use(apiKey);
// check permissions
router.use(permissions(['0000'])); // 0000 is the default permission for all API keys
router.use('/v1/api/product', require('./product')); // Import product routes
router.use('/v1/api', accessRouter);
module.exports = router;