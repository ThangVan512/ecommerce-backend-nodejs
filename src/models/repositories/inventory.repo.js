'use strict'
const { convertToObjectIdMongodb } = require("../../utils");
const Inventory = require("../inventory.model");
const { Types } = require('mongoose');

const insertInventory = async ({ productId, shopId, stock, location = 'Unknown' }) => {
    return await Inventory.create({
        inventory_productId: productId,
        inventory_location: location,
        inventory_stock: stock,
        inventory_shopId: shopId,
        inventory_reservation: [],
    });
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inventory_productId: convertToObjectIdMongodb(productId),
        inventory_stock: { $gte: quantity },
    }, updateSet = {
        $inc: { inventory_stock: -quantity },
        $push: { inventory_reservation: { cartId, quantity } }
    }, options = {
        new: true,
        upsert: true,
    };
    return await Inventory.findOneAndUpdate(query, updateSet, options);
}
module.exports = {
    insertInventory,    
    reservationInventory,
}