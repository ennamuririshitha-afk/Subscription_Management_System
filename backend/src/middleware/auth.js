const jwt = require("jsonwebtoken");
const prisma = require("../services/prisma");

const getToken = (req) => {
  // Read JWT from HTTP-only cookie
  const cookies = req.headers.cookie || "";
  const tokenCookie = cookies
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith("accessToken="));

  if (tokenCookie) {
    return decodeURIComponent(tokenCookie.substring("accessToken=".length));
  }

  // Also support Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
};

const authenticate = async (req, res, next) => {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Authentication configuration error",
      });
    }

    const token = getToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }

    console.error("Authentication error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};