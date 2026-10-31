const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPayments,
  getPaymentsByInvoice
} = require("../controllers/paymentController");

// Record a payment
router.post("/", createPayment);

// Get all payments
router.get("/", getPayments);

// Get payments for a specific invoice
router.get("/invoice/:invoiceId", getPaymentsByInvoice);

module.exports = router;