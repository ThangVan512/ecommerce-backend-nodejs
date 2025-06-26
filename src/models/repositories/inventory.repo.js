'use strict'
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

module.exports = {
    insertInventory,    
}