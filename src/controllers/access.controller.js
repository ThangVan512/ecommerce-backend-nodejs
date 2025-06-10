"use strict";
const AccessService = require("../services/access.service.js"); // Importing the AccessService
const { OKResponse, CreatedResponse } = require("../core/success.response.js"); // Importing the OKResponse class
class AccessController {
  constructor() {
    // Initialize any properties or dependencies here if needed
  }

  handlerRefreshToken = async (req, res, next) => {
    new OKResponse({
      message: "Get token successful",
      metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    }).send(res);
  };
  logout = async (req, res, next) => {
    new OKResponse({
      message: "Logout successful",
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };

  login = async (req, res, next) => {
    const { email, password } = req.body; // Destructuring email and password from request body
    if (!email || !password) {
      return next(new BadRequestError("Email and password are required"));
    }
    const user = await AccessService.login(req.body); // Calling the login method from AccessService
    if (!user) {
      return next(new UnauthorizedError("Invalid email or password"));
    }
    new OKResponse({
      message: "Login successful",
      data: user,
    }).send(res); // Sending a successful response with user data
  };

  signUp = async (req, res, next) => {
    new CreatedResponse({
      message: "User created successfully",
      data: await AccessService.signUp(req.body),
    }).send(res);
  };
}
module.exports = new AccessController(); // Exporting an instance of AccessController for use in routes
