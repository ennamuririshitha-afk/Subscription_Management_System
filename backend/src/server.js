
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import existing routes
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");

// Product management
const productRoutes = require("./modules/products/product.routes");

// Billing and subscription management
const quotationRoutes = require("./routes/quotationRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.use(express.json());

// Root API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Subscription Management System API",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "success",
    message: "Backend is running",
  });
});

// Authentication API
app.use("/api/auth", authRoutes);

// Customer management API
app.use("/api/customers", customerRoutes);

// Product management API
app.use("/api/products", productRoutes);

// Dashboard API
app.use("/api/dashboard", dashboardRoutes);

// Quotation API
app.use("/api/quotations", quotationRoutes);

// Subscription API
app.use("/api/subscriptions", subscriptionRoutes);

// Invoice API
app.use("/api/invoices", invoiceRoutes);

// Payment API
app.use("/api/payments", paymentRoutes);

// Reports API
app.use("/api/reports", reportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


<<<<<<< HEAD
// Customer management routes
app.use("/api/customers", customerRoutes);

// Product management routes
app.use("/api/products", productRoutes);

// Dashboard routes
=======
// Dashboard
>>>>>>> origin/main
app.use("/api/dashboard", dashboardRoutes);

// Quotations
app.use("/api/quotations", quotationRoutes);

// Subscriptions
app.use("/api/subscriptions", subscriptionRoutes);

// Invoices
app.use("/api/invoices", invoiceRoutes);

// Payments
app.use("/api/payments", paymentRoutes);

// Reports
app.use("/api/reports", reportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
