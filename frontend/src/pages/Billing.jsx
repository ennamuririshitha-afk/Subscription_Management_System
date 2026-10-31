
import React, { useEffect, useState } from "react";
import api from "../services/api";

const modules = ["Quotations", "Subscriptions", "Invoices", "Payments", "Reports"];

export default function Billing() {
  const [active, setActive] = useState("Quotations");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const endpoints = {
    Quotations: "/quotations",
    Subscriptions: "/subscriptions",
    Invoices: "/invoices",
    Payments: "/payments",
    Reports: "/reports/billing"
  };

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(endpoints[active]);
      const result = response.data.data;
      setData(active === "Reports" ? result : result || []);
    } catch (err) {
      setData([]);
      setError(err.response?.data?.message || "Unable to load data. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [active]);

  const createQuotation = async () => {
    const userId = prompt("Enter existing Customer/User ID:");
    if (!userId) return;
    const amount = prompt("Enter quotation amount:");
    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) return alert("Enter a valid amount.");
    const quotationNumber = "QT-" + Date.now();

    try {
      await api.post("/quotations", {
        quotationNumber,
        amount: Number(amount),
        userId
      });
      alert("Quotation created successfully");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Quotation creation failed");
    }
  };

  const createSubscription = async () => {
    const userId = prompt("Enter existing Customer/User ID:");
    if (!userId) return;
    const planId = prompt("Enter existing Plan ID:");
    if (!planId) return;

    try {
      await api.post("/subscriptions", {
        userId,
        planId,
        startDate: new Date().toISOString()
      });
      alert("Subscription created successfully");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Subscription creation failed");
    }
  };

  const createInvoice = async () => {
    const userId = prompt("Enter existing Customer/User ID:");
    if (!userId) return;
    const amount = prompt("Enter invoice amount:");
    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) return alert("Enter a valid amount.");

    try {
      await api.post("/invoices", {
        invoiceNumber: "INV-" + Date.now(),
        amount: Number(amount),
        userId,
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString()
      });
      alert("Invoice created successfully");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Invoice creation failed");
    }
  };

  const recordPayment = async () => {
    const invoiceId = prompt("Enter Invoice ID:");
    if (!invoiceId) return;
    const amount = prompt("Enter payment amount:");
    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) return alert("Enter a valid amount.");
    const method = prompt("Payment method: CASH, CARD, UPI, BANK_TRANSFER, OTHER", "UPI");

    try {
      await api.post("/payments", {
        invoiceId,
        amount: Number(amount),
        method: method || "OTHER"
      });
      alert("Payment recorded successfully");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  const actions = {
    Quotations: createQuotation,
    Subscriptions: createSubscription,
    Invoices: createInvoice,
    Payments: recordPayment
  };

  const report = data?.billing ? data : null;

  return (
    <div style={{ padding: 24, color: "#172033" }}>
      <h2>Billing Management</h2>
      <p>Manage quotations, subscriptions, invoices and payments.</p>

      <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "20px 0" }}>
        {modules.map(module => (
          <button key={module} onClick={() => setActive(module)}
            style={{
              padding: "10px 16px",
              border: 0,
              borderRadius: 6,
              cursor: "pointer",
              background: active === module ? "#2563eb" : "#e5e7eb",
              color: active === module ? "white" : "#172033"
            }}>
            {module}
          </button>
        ))}
      </nav>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h3>{active}</h3>
        <div>
          {actions[active] && (
            <button onClick={actions[active]} style={{ padding: 10, marginRight: 8 }}>
              + Create {active.slice(0, -1)}
            </button>
          )}
          <button onClick={loadData} style={{ padding: 10 }}>Refresh</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {report && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
          {Object.entries(report).map(([section, values]) => (
            <div key={section} style={{ padding: 18, background: "#f3f4f6", borderRadius: 8 }}>
              <h4>{section}</h4>
              {Object.entries(values).map(([key, value]) => (
                <p key={key}>{key}: <strong>{String(value)}</strong></p>
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && !error && !report && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["ID", "Number", "Customer", "Amount", "Status", "Created"].map(title => (
                  <th key={title} style={{ padding: 12, background: "#e5e7eb", textAlign: "left" }}>{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: 20 }}>No {active.toLowerCase()} found.</td></tr>
              ) : data.map(item => (
                <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: 12 }}>{item.id?.slice(0, 8)}</td>
                  <td style={{ padding: 12 }}>{item.quotationNumber || item.invoiceNumber || item.id?.slice(0, 8)}</td>
                  <td style={{ padding: 12 }}>{item.user?.name || "-"}</td>
                  <td style={{ padding: 12 }}>₹{item.amount ?? "-"}</td>
                  <td style={{ padding: 12 }}>{item.status || item.method || "-"}</td>
                  <td style={{ padding: 12 }}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
