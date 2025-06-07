'use strict'
const JWT = require('jsonwebtoken'); // Import the jsonwebtoken library
const createTokenPair = async ( payload, privateKey, publicKey, expiresIn = '1h' ) => {
    try { 
        // Create a JWT token pair (access and refresh tokens)
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256', // Use RS256 algorithm for signing
            expiresIn: expiresIn, // Set the expiration time for the access token
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256', // Use RS256 algorithm for signing
            expiresIn: '7d', // Set a longer expiration time for the refresh token
        });
        
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error("Access token verification failed:", err);
                throw new Error("Invalid access token");
            }
            console.log("Access token verified successfully:", decode);
        }) // Verify the access token with the public key
        return { accessToken, refreshToken }; // Return both tokens as an object
    }
    catch (error) {
        console.error("Error creating token pair:", error);
        throw error; // Re-throw the error for further handling
    }
}

module.exports = {
    createTokenPair // Export the createTokenPair function for use in other modules
};