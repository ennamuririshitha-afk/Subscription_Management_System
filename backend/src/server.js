const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Root API
app.get("/", (req, res) => {
  res.json({
    message: "Subscription Management System API",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is running",
  });
});

// Dashboard routes
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});