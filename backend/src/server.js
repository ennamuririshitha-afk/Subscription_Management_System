const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import all route files
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
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

// Authentication APIs
app.use("/api/auth", authRoutes);

// Dashboard APIs
app.use("/api/dashboard", dashboardRoutes);

// Quotation APIs
app.use("/api/quotations", quotationRoutes);

// Subscription APIs
app.use("/api/subscriptions", subscriptionRoutes);

// Invoice APIs
app.use("/api/invoices", invoiceRoutes);

// Payment APIs
app.use("/api/payments", paymentRoutes);

// Reports APIs
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