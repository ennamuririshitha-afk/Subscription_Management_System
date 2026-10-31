
const express = require("express");

const {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

// All customer routes require login
router.use(authenticate);

// ADMIN and STAFF can view customers
router.get("/", authorize("ADMIN", "STAFF"), listCustomers);

// ADMIN and STAFF can create customers
router.post("/", authorize("ADMIN", "STAFF"), createCustomer);

// ADMIN and STAFF can view customer details
router.get("/:id", authorize("ADMIN", "STAFF"), getCustomer);

// ADMIN and STAFF can update customers
router.put("/:id", authorize("ADMIN", "STAFF"), updateCustomer);

// Only ADMIN can delete customers
router.delete("/:id", authorize("ADMIN"), deleteCustomer);

module.exports = router;
