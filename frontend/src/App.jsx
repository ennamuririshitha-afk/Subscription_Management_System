
import React from "react";

const dashboardStats = [
  {
    title: "Active Subscriptions",
    value: "0",
    icon: "📋",
    color: "#2563eb",
  },
  {
    title: "Monthly Revenue",
    value: "₹0",
    icon: "💰",
    color: "#16a34a",
  },
  {
    title: "Pending Invoices",
    value: "0",
    icon: "🧾",
    color: "#d97706",
  },
  {
    title: "Overdue Payments",
    value: "0",
    icon: "⚠️",
    color: "#dc2626",
  },
];

function App() {
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
          <span className="status">System Online</span>
        </div>

        <section className="stats-grid">
          {dashboardStats.map((item) => (
            <article className="stat-card" key={item.title}>
              <div className="stat-header">
                <span>{item.title}</span>
                <span className="stat-icon">{item.icon}</span>
              </div>
              <h2 style={{ color: item.color }}>{item.value}</h2>
              <small>Updated dashboard summary</small>
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
              <strong>http://localhost:5000</strong>
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
          <h3>Recent Activity</h3>
          <p>No activities available yet.</p>
          <small>Subscription and invoice activities will appear here.</small>
        </section>
      </main>

      <footer>
        Subscription Management System © 2026
      </footer>
    </div>
  );
}

export default App;
