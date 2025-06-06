'use strict'

class AccessController {
    constructor() {
        // Initialize any properties or dependencies here if needed
    }

    signUp = async (req, res, next) => {
        try {
            console.log("Sign Up request received:", req.body);
            return res.status(200).json({
                code: 20001,
                message: "Sign Up successful",
                metadata: {
                    userid: 1, // Assuming req.body contains user data
                },
            });
        } catch (error) {
            console.error("Error during sign up:", error);  
        }
    }   
}
module.exports = new AccessController(); // Exporting an instance of AccessController for use in routes