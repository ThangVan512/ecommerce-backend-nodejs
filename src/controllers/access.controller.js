'use strict'
const AccessService = require('../services/access.service.js'); // Importing the AccessService
class AccessController {
    constructor() {
        // Initialize any properties or dependencies here if needed
    }

    signUp = async (req, res, next) => {
        try {
            console.log("Sign Up request received:", req.body);
            return res.status(200).json(await AccessService.signUp(req.body));
        } catch (error) {
            console.error("Error during sign up:", error);  
        }
    }   
}
module.exports = new AccessController(); // Exporting an instance of AccessController for use in routes