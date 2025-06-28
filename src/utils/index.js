'use strict'

const _= require('lodash');
const { Types } = require('mongoose');
const getInfoData = ({ fields =[], object ={}})=> {
    return _.pick(object, fields);
}

function convertToObjectIdMongodb(id) {
  return new Types.ObjectId(id); // ✅ CORRECT
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]));
}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]));
}
// Remove undefined and null values from an object
const removeUndeFineObject = (object = {}) => {
    Object.keys(object).forEach(key => {
        if (object[key] === undefined || object[key] === null) {
            delete object[key];
        }
    }
    );
    return object;
}

const updateNestedObjectParser = (object = {}) => {
    const final = {}
    Object.keys(object).forEach(key => {
        if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
            Object.keys(object[key]).forEach(subKey => {
                final[`${key}.${subKey}`] = object[key][subKey];
            });
        } else {
            final[key] = object[key];
        }
    });
    return final;
}
module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndeFineObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb
}