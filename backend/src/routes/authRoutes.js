const express = require("express");

const {
  register,
  login,
  createStaff,
  getMe,
  logout,
} = require("../controllers/authController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

// Only ADMIN can create STAFF accounts.
router.post(
  "/staff",
  authenticate,
  authorize("ADMIN"),
  createStaff
);

module.exports = router;