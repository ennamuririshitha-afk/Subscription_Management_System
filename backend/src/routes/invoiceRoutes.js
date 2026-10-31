const express = require("express");
const router = express.Router();

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus
} = require("../controllers/invoiceController");

// Create invoice
router.post("/", createInvoice);

// Get all invoices
router.get("/", getInvoices);

// Get invoice by ID
router.get("/:id", getInvoiceById);

// Update invoice status
router.patch("/:id/status", updateInvoiceStatus);

module.exports = router;