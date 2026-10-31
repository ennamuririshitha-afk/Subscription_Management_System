const express = require("express");
const router = express.Router();

const {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotationStatus
} = require("../controllers/quotationController");

router.post("/", createQuotation);
router.get("/", getQuotations);
router.get("/:id", getQuotationById);
router.patch("/:id/status", updateQuotationStatus);

module.exports = router;