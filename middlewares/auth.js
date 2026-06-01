const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("./error-handler");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if authorization header exists
  if (!authorization || !authorization.startsWith("Bearer ")) {
    // delegate to centralized error handler
    return next(new UnauthorizedError("Authorization required"));
  }

  // Extract and verify token
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // Token is invalid
    // delegate to centralized error handler
    return next(new UnauthorizedError("Invalid token"));
  }
  // Success: Add user info and continue
  req.user = payload;

  return next();
};

module.exports = auth;
