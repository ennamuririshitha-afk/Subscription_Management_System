const express = require("express");
const router = express.Router();

const {
  getBillingReports
} = require("../controllers/reportController");

// Get billing reports
router.get("/billing", getBillingReports);

module.exports = router;