'use strict'

const { model } = require("mongoose")
const { getSelectData, unGetSelectData } = require("../../utils");
const findAllDiscountCodeUnSelect = async({
    limit= 50,
    page= 1,
    sort= "ctime",
    filter = {},
    unSelect,
    model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };
    const products = await model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortBy)
        .select(unGetSelectData(unSelect))
        .lean()
    return products;
}

const findAllDiscountCodeSelect = async({
    limit= 50,
    page= 1,
    sort= "ctime",
    filter = {},
    select,
    model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };
    const products = await model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortBy)
        .select(getSelectData(select))
        .lean()
    return products;
}

const checkDiscountExits = async ({model, filter}) => {
    return await model.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect,
    checkDiscountExits
}