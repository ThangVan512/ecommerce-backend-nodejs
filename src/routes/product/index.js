'use strict'

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auths/authUtils');


// authentication   
router.use(authentication); // Apply authentication middleware to all routes below this point
////
router.post('', asyncHandler(productController.createProduct));

module.exports = router;