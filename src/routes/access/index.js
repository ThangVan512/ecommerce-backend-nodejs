'use strict'

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auths/authUtils');

// signup
router.post('/shop/signup', asyncHandler(accessController.signUp));
// login
router.post('/shop/login', asyncHandler(accessController.login));
// authentication   
router.use(authentication); // Apply authentication middleware to all routes below this point
////
router.post('/shop/logout', asyncHandler(accessController.logout));
module.exports = router;