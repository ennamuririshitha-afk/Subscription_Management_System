const prisma = require("../db");

// Create subscription
exports.createSubscription = async (req, res) => {
  try {
    const {
      userId,
      planId,
      startDate,
      endDate,
      nextBillingDate,
      status
    } = req.body;

    if (!userId || !planId || !startDate) {
      return res.status(400).json({
        success: false,
        message: "User ID, Plan ID and Start Date are required"
      });
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        nextBillingDate: nextBillingDate
          ? new Date(nextBillingDate)
          : null,
        status: status || "DRAFT"
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: true
      }
    });

    res.status(201).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get subscription by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        plan: { include: { product: true } },
        invoices: true
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }

    res.json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update subscription status
exports.updateSubscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "DRAFT",
      "QUOTATION",
      "CONFIRMED",
      "ACTIVE",
      "PAUSED",
      "CLOSED"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription status"
      });
    }

    const subscription = await prisma.subscription.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete subscription
exports.deleteSubscription = async (req, res) => {
  try {
    await prisma.subscription.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: "Subscription deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};