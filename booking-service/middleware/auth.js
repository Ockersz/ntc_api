const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  return next();
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided or invalid format" });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    // Verify the JWT token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request for later use
    req.user = payload;
    // Extract resource and access type from the request
    const resource = getResourceFromPath(req.path);
    const accessType = getAccessType(req.method);

    if (!resource || !accessType) {
      return res
        .status(400)
        .json({ message: "Invalid resource or access type" });
    }

    // Check user permissions
    const userPermissions = payload.permissions || {};
    if (!hasPermissions(userPermissions[resource], accessType)) {
      return res.status(403).json({
        message: "User does not have permission to access this resource",
      });
    }

    // If all checks pass, proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    // Handle unexpected errors
    return res.status(500).json({
      message: "An error occurred while verifying the token",
      error: error.message,
    });
  }
};

const getResourceFromPath = (path) => {
  const segments = path.split("/").filter(Boolean); // Remove empty segments
  return segments.length > 0 ? segments[0] : null;
};

const getAccessType = (method) => {
  switch (method.toUpperCase()) {
    case "GET":
      return "read";
    case "POST":
      return "write";
    case "PUT":
      return "update";
    case "DELETE":
      return "delete";
    default:
      return null;
  }
};

const hasPermissions = (userPermissions, requiredPermission) => {
  if (!userPermissions) {
    return false;
  }
  return userPermissions.includes(requiredPermission);
};

module.exports = authMiddleware;
