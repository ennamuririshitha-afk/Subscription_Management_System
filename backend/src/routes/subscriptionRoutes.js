const express = require("express");
const router = express.Router();

const {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscriptionStatus,
  deleteSubscription
} = require("../controllers/subscriptionController");

// Create subscription
router.post("/", createSubscription);

// Get all subscriptions
router.get("/", getSubscriptions);

// Get subscription by ID
router.get("/:id", getSubscriptionById);

// Update subscription status
router.patch("/:id/status", updateSubscriptionStatus);

// Delete subscription
router.delete("/:id", deleteSubscription);

module.exports = router;