import React, { useEffect, useState } from "react";
import api from "./services/api";
import Billing from "./pages/Billing";

function App() {
  const [page, setPage] = useState("Dashboard");
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    pendingInvoices: 0,
    overduePayments: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [healthResponse, statsResponse] = await Promise.all([
        api.get("/health"),
        api.get("/dashboard/stats"),
      ]);

      setBackendStatus(
        healthResponse.data.message || "Backend is running"
      );

      setStats({
        activeSubscriptions:
          statsResponse.data.data?.activeSubscriptions ?? 0,
        monthlyRevenue:
          statsResponse.data.data?.monthlyRevenue ?? 0,
        pendingInvoices:
          statsResponse.data.data?.pendingInvoices ?? 0,
        overduePayments:
          statsResponse.data.data?.overduePayments ?? 0,
      });
    } catch (error) {
      console.error("Dashboard API Error:", error);
      setBackendStatus("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const openBilling = (module) => {
    setPage(module);
  };

  if (page !== "Dashboard") {
    return (
      <div className="app">
        <header className="topbar">
          <div>
            <h1>Subscription Management System</h1>
            <p>Billing and Subscription Management</p>
          </div>

          <button onClick={() => setPage("Dashboard")}>
            Back to Dashboard
          </button>
        </header>

        <Billing />
      </div>
    );
  }

  const cards = [
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions,
      icon: "📋",
      description: "Currently active subscriptions",
    },
    {
      title: "Monthly Revenue",
      value: `₹${Number(stats.monthlyRevenue).toLocaleString("en-IN")}`,
      icon: "💰",
      description: "Revenue collected this month",
    },
    {
      title: "Pending Invoices",
      value: stats.pendingInvoices,
      icon: "📄",
      description: "Invoices awaiting payment",
    },
    {
      title: "Overdue Payments",
      value: stats.overduePayments,
      icon: "⚠️",
      description: "Payments past their due date",
    },
  ];

  const quickActions = [
    {
      title: "Manage Subscriptions",
      description: "Create and manage customer subscriptions",
      icon: "📋",
      page: "Subscriptions",
    },
    {
      title: "Manage Quotations",
      description: "Create and track customer quotations",
      icon: "📝",
      page: "Quotations",
    },
    {
      title: "Manage Invoices",
      description: "Generate and manage invoices",
      icon: "📄",
      page: "Invoices",
    },
    {
      title: "Manage Payments",
      description: "Record and track customer payments",
      icon: "💳",
      page: "Payments",
    },
    {
      title: "Billing Reports",
      description: "View billing and revenue reports",
      icon: "📊",
      page: "Reports",
    },
  ];

  const isOnline = backendStatus === "Backend is running";

  return (
    <div className="app">
      {/* Header */}
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
        {/* Dashboard heading */}
        <section className="welcome-section">
          <div>
            <h2>Dashboard Overview</h2>
            <p>
              Welcome! Here is your business summary.
            </p>
          </div>

          <div className="dashboard-controls">
            <span
              className="status"
              style={{
                color: isOnline ? "#16a34a" : "#dc2626",
                fontWeight: "600",
              }}
            >
              ● {backendStatus === "Backend is running"
                ? "System Online"
                : backendStatus}
            </span>

            <button onClick={loadDashboard}>
              ↻ Refresh
            </button>
          </div>
        </section>

        {/* Statistics */}
        <section className="stats-grid">
          {cards.map((card) => (
            <article className="stat-card" key={card.title}>
              <div className="stat-header">
                <span>{card.title}</span>
                <span>{card.icon}</span>
              </div>

              <h2>
                {loading ? "..." : card.value}
              </h2>

              <small>{card.description}</small>
            </article>
          ))}
        </section>

        {/* Main dashboard content */}
        <section className="content-grid">
          {/* Quick Actions */}
          <article className="panel">
            <h3>Quick Actions</h3>
            <p>Access the main system modules.</p>

            <div className="action-list">
              {quickActions.map((action) => (
                <button
                  key={action.page}
                  onClick={() => openBilling(action.page)}
                  className="action-button"
                >
                  <span>{action.icon}</span>

                  <div>
                    <strong>{action.title}</strong>
                    <small>{action.description}</small>
                  </div>

                  <span>→</span>
                </button>
              ))}
            </div>
          </article>

          {/* System Information */}
          <article className="panel">
            <h3>Project Information</h3>
            <p>Application and infrastructure status.</p>

            <div className="info-row">
              <span>Frontend</span>
              <strong className="success">Running</strong>
            </div>

            <div className="info-row">
              <span>Backend API</span>
              <strong
                style={{
                  color: isOnline ? "#16a34a" : "#dc2626",
                }}
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
              <span>ORM</span>
              <strong>Prisma</strong>
            </div>

            <div className="info-row">
              <span>Authentication</span>
              <strong>JWT</strong>
            </div>

            <div className="info-row">
              <span>Application</span>
              <strong>Subscription Management</strong>
            </div>
          </article>
        </section>
      </main>

      <footer>
        Subscription Management System © 2026
      </footer>
    </div>
  );
}

export default App;