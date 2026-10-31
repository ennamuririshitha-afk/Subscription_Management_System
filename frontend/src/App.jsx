import React, { useEffect, useState, useCallback } from "react";
import api from "./services/api";

const initialStats = [
  {
    title: "Active Subscriptions",
    value: "0",
    icon: "📋",
    color: "#2563eb",
    key: "activeSubscriptions",
  },
  {
    title: "Monthly Revenue",
    value: "₹0",
    icon: "💰",
    color: "#16a34a",
    key: "monthlyRevenue",
  },
  {
    title: "Pending Invoices",
    value: "0",
    icon: "🧾",
    color: "#d97706",
    key: "pendingInvoices",
  },
  {
    title: "Overdue Payments",
    value: "0",
    icon: "⚠️",
    color: "#dc2626",
    key: "overduePayments",
  },
];

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const checkBackend = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/health");

      setBackendStatus(
        response.data.message || "Backend is running"
      );
    } catch (error) {
      console.error("Backend connection error:", error);
      setBackendStatus("Backend connection failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkBackend();
  }, [checkBackend]);

  const refreshDashboard = () => {
    checkBackend();
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Subscription Management System</h1>
          <p>Manage your subscription business efficiently</p>
        </div>

        <div className="admin-info">
          <span>Administrator</span>
          <div className="avatar">A</div>
        </div>
      </header>

      <main className="main-content">
        <div className="welcome-section">
          <div>
            <h2>Dashboard Overview</h2>
            <p>Welcome! Here is your business summary.</p>
          </div>

          <span
            className={
              backendStatus === "Backend is running"
                ? "status"
                : "status status-error"
            }
          >
            {backendStatus === "Backend is running"
              ? "System Online"
              : backendStatus}
          </span>
        </div>

        <section className="stats-grid">
          {stats.map((item) => (
            <article className="stat-card" key={item.key}>
              <div className="stat-header">
                <span>{item.title}</span>
                <span className="stat-icon">{item.icon}</span>
              </div>

              <h2 style={{ color: item.color }}>
                {item.value}
              </h2>

              <small>Dashboard summary</small>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel">
            <h3>Quick Actions</h3>

            <div className="action-list">
              <button type="button">+ Create Subscription</button>
              <button type="button">+ Add Customer</button>
              <button type="button">+ Create Invoice</button>
              <button type="button">+ Add Product</button>
            </div>
          </article>

          <article className="panel">
            <h3>Project Information</h3>

            <div className="info-row">
              <span>Frontend</span>
              <strong className="success">Running</strong>
            </div>

            <div className="info-row">
              <span>Backend API</span>
              <strong
                className={
                  backendStatus === "Backend is running"
                    ? "success"
                    : ""
                }
              >
                {backendStatus}
              </strong>
            </div>

            <div className="info-row">
              <span>Backend URL</span>
              <strong>localhost:5000</strong>
            </div>

            <div className="info-row">
              <span>Database</span>
              <strong>PostgreSQL / Supabase</strong>
            </div>

            <div className="info-row">
              <span>Application</span>
              <strong>Development</strong>
            </div>
          </article>
        </section>

        <section className="panel activity-panel">
          <div className="stat-header">
            <h3>Recent Activity</h3>

            <button
              type="button"
              onClick={refreshDashboard}
              disabled={loading}
            >
              {loading ? "Checking..." : "Refresh"}
            </button>
          </div>

          <p>No activities available yet.</p>
          <small>
            Subscription and invoice activities will appear here
            once those modules are integrated.
          </small>

          {lastUpdated && (
            <small>Last updated: {lastUpdated}</small>
          )}
        </section>
      </main>

      <footer>
        Subscription Management System © 2026
      </footer>
    </div>
  );
}

export default App;