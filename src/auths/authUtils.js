"use strict";
const JWT = require("jsonwebtoken"); // Import the jsonwebtoken library
const asyncHandler = require("../helpers/asyncHandler"); // Import the asyncHandler utility
const { UnauthorizedError, NotFoundError } = require("../core/error.response"); // Import the UnauthorizedError class for error handling
//service
// Import the KeyTokenService to manage key tokens
const { findByUserId } = require("../services/keyToken.service"); // Import the KeyTokenService to manage key tokens
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "refresh-token",
};
const createTokenPair = async (
  payload,
  privateKey,
  publicKey,
  expiresIn = "1h"
) => {
  try {
    // Create a JWT token pair (access and refresh tokens)
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: expiresIn, // Set the expiration time for the access token
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7d", // Set a longer expiration time for the refresh token
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("Access token verification failed:", err);
        throw new Error("Invalid access token");
      }
      console.log("Access token verified successfully:", decode);
    }); // Verify the access token with the public key
    return { accessToken, refreshToken }; // Return both tokens as an object
  } catch (error) {
    console.error("Error creating token pair:", error);
    throw error; // Re-throw the error for further handling
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID] || req.query.clientId; // Get user ID from headers or query parameters
  if (!userId) {
    throw new UnauthorizedError("Unauthorized: No client ID provided"); // Throw an error if no user ID is found
  }
  const keyStore = await findByUserId(userId); // Fetch the key store using the user ID
  if (!keyStore) {
    throw new NotFoundError("Unauthorized: Key store not found"); // Throw an error if the key store is not found
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION]; // Get the access token from the authorization header
  if (!accessToken) {
    throw new UnauthorizedError("Unauthorized: No access token provided"); // Throw an error if no access token is found
  }
  // Verify the access token using the public key
  try {
    const decodedUser = JWT.verify(accessToken, keyStore.publicKey); // Verify the access token with the public key
    if (userId !== decodedUser.user) {
      throw new UnauthorizedError(
        "Unauthorized: Invalid user ID in access token"
      ); // Throw an error if the user ID in the token does not match
    }
    req.keyStore = keyStore; // Attach the key store to the request object for further use
    next(); // Call the next middleware function if verification is successful
  } catch (error) {
    console.error("Access token verification failed:", error);
    throw new UnauthorizedError("Unauthorized: Invalid access token"); // Throw an error if the access token is invalid
  }
});

const verifyJWT = async (token, keySecret) => {
  try {
    // Verify the JWT token using the provided public key
    const decoded = JWT.verify(token, keySecret);
    return decoded; // Return the decoded token if verification is successful
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw new UnauthorizedError("Unauthorized: Invalid JWT token"); // Throw an error if verification fails
  }
}



module.exports = {
  createTokenPair, // Export the createTokenPair function for use in other modules
  authentication, // Export the authentication middleware for use in routes
};
