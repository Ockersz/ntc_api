const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  return next(); // Disable authentication for now
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

    // Check if the request comes from a trusted service
    if (
      payload.service &&
      payload.service === process.env.TRUSTED_SERVICE_NAME
    ) {
      // Inter-service communication detected, bypass permissions check
      return next();
    }

    // For user tokens, continue with normal permission checks
    req.user = payload;

    const resource = getResourceFromPath(req.path);
    const accessType = getAccessType(req.method);

    if (!resource || !accessType) {
      return res
        .status(400)
        .json({ message: "Invalid resource or access type" });
    }

    const userPermissions = payload.permissions || {};
    if (!hasPermissions(userPermissions[resource], accessType)) {
      return res.status(403).json({
        message: "User does not have permission to access this resource",
      });
    }

    // If all checks pass, proceed
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

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
