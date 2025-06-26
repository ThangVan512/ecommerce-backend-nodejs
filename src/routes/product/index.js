'use strict'

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auths/authUtils');

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));
router.get('', asyncHandler(productController.findAllProducts));
router.get('/:product_id', asyncHandler(productController.findProduct));
// authentication   
router.use(authentication); // Apply authentication middleware to all routes below this point
////
router.post('', asyncHandler(productController.createProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));
// Query all products for shop
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishForShop));
module.exports = router;