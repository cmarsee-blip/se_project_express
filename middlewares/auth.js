const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if authorization header exists
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization required" });
  }

  try {
    // Extract and verify token
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);

    // Success: Add user info and continue
    req.user = payload;
    next();
  } catch (error) {
    // Token is invalid
    return res.status(UNAUTHORIZED).json({ message: "Invalid token" });
  }
};

module.exports = auth;
