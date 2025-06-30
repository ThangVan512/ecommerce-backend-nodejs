'use strict'

const cart = require('../../models/cart.model');

const { Types } = require('mongoose');
const { BadRequestError, NotFoundError } = require('../../core/error.response');
const { convertToObjectIdMongodb } = require('../../utils');

const findCartByUserId = async (userId) => {
    return await cart.findOne({
        cart_userId: convertToObjectIdMongodb(userId),
        cart_state: 'active'
    }).lean();
}

module.exports = {
    findCartByUserId,
}