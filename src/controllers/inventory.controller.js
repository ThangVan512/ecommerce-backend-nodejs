"use strict";
const InventoryService = require("../services/inventory.service");

const { OKResponse } = require("../core/success.response");

class InventoryController {
    addStockToInventory = async (req, res) => {
        new OKResponse({
            message: "Add stock to inventory successfully",
            metadata: await InventoryService.addStockToInventory(req.body),
        }).send(res);
    }
}
module.exports = new InventoryController();