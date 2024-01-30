/**
 * 
 * Create a middleware.js file that  exports an authMiddleware function
 * Checks the headers for an Authorization header (Bearer <token>)
 * Verifies that the token is valid
 * Puts the userId in the request object if the token checks out.
 * If not, return a 403 status back to the user
 
 */

const jwt = require("jsonwebtoken");
import { JWT_SECRET } from "../config/jwt";

const authMiddleware = (req, res, next) => {
  // get the token from the headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  // Bearer <token> --> token in on the 2nd index
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;
