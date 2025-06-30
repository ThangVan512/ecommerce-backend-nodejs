'use strict';

const inventory = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");
const { NotFoundError } = require("../core/error.response");
class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = "Unknown"
    }) {
        const product = await getProductById(productId);
        if (!product) {
            throw new NotFoundError(
                `Product with ID ${productId} not found.`
            );
        }
        const query ={ inventory_productId: productId, inventory_shopId: shopId };
        const updateSet = {
            $inc: { inventory_stock: stock },
            $set: { inventory_location: location }
        };
        const options = { new: true, upsert: true };
        const updatedInventory = await inventory.findOneAndUpdate(query, updateSet, options);
        if (!updatedInventory) {
            throw new NotFoundError(
                `Inventory for product ID ${productId} and shop ID ${shopId} not found.`
            );
        }
        return updatedInventory;
    }
}
module.exports = InventoryService;