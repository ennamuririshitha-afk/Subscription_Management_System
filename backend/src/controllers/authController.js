const jwt = require("jsonwebtoken");
const authService = require("../services/authService");

const COOKIE_NAME = "accessToken";
const TOKEN_EXPIRY = "8h";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 8 * 60 * 60 * 1000,
});

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must contain between 8 and 72 characters",
      });
    }

    const user = await authService.registerCustomer({
      name,
      email,
      password,
    });

    const token = generateToken(user);

    res.cookie(COOKIE_NAME, token, cookieOptions());

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { user },
    });
  } catch (error) {
    if (error.code === "P2002" || error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Registration failed",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await authService.loginUser({ email, password });
    const token = generateToken(user);

    res.cookie(COOKIE_NAME, token, cookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode === 401
          ? "Invalid email or password"
          : "Login failed",
    });
  }
};

const createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must contain between 8 and 72 characters",
      });
    }

    const user = await authService.createStaff({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Staff account created successfully",
      data: { user },
    });
  } catch (error) {
    if (error.code === "P2002" || error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    console.error("Staff creation error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Staff account creation failed",
    });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};

const logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

module.exports = {
  register,
  login,
  createStaff,
  getMe,
  logout,
};