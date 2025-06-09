'use strict'
const { findById } = require('../services/apikey.service');
const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const apiKey = async (req, res, next ) => {
    try{
        const apiKeyValue = req.headers[HEADER.API_KEY] || req.query.apiKey;
        if (!apiKeyValue || apiKeyValue !== process.env.API_KEY) {
            return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
        }
        // check objKey
        const objKey = await findById(apiKeyValue);
        if (!objKey) {
            return res.status(403).json({ message: 'Forbidden: API Key not found' });
        }
        // Check if the API key is active
        if (!objKey.status) {
            return res.status(403).json({ message: 'Forbidden: API Key is inactive' });
        }
        // Attach the API key object to the request for further use
        req.apiKey = objKey;
        return next();
    } catch (error) {
        console.error('Error in API Key middleware:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const permissions = (requiredPermissions) => {
    return (req, res, next) => {
        const apiKey = req.apiKey;
        if (!apiKey || !apiKey.permissions) {
            return res.status(403).json({ message: 'Forbidden: No permissions found' });
        }
        
        // Check if the API key has the required permissions
        const hasPermission = requiredPermissions.every(permission => 
            apiKey.permissions.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        next();
    }
}

module.exports = { apiKey, HEADER, permissions };