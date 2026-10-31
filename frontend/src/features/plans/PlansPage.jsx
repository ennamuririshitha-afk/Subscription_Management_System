
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CalendarDays,
  IndianRupee,
  RefreshCw,
  Package,
  X,
  Layers,
} from "lucide-react";
import "./PlansPage.css";

const initialForm = {
  name: "",
  productName: "",
  cycle: "MONTHLY",
  price: "",
  minimumQuantity: "1",
  startDate: "",
  endDate: "",
  autoRenew: true,
};

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const filteredPlans = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return plans;

    return plans.filter((plan) =>
      [plan.name, plan.productName, plan.cycle]
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [plans, search]);

  const averagePrice = useMemo(() => {
    if (!plans.length) return 0;

    return plans.reduce((sum, plan) => sum + Number(plan.price), 0)
      / plans.length;
  }, [plans]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (plan) => {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      productName: plan.productName,
      cycle: plan.cycle,
      price: String(plan.price),
      minimumQuantity: String(plan.minimumQuantity),
      startDate: plan.startDate,
      endDate: plan.endDate,
      autoRenew: plan.autoRenew,
    });
    setError("");
    setShowForm(true);
  };

  const savePlan = (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.productName.trim() ||
      !form.price ||
      !form.minimumQuantity
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (Number(form.price) <= 0) {
      setError("Plan price must be greater than zero.");
      return;
    }

    if (
      !Number.isInteger(Number(form.minimumQuantity)) ||
      Number(form.minimumQuantity) < 1
    ) {
      setError("Minimum quantity must be a whole number of at least 1.");
      return;
    }

    if (
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    const planData = {
      ...form,
      name: form.name.trim(),
      productName: form.productName.trim(),
      price: Number(form.price),
      minimumQuantity: Number(form.minimumQuantity),
    };

    if (editingId) {
      setPlans((previous) =>
        previous.map((plan) =>
          plan.id === editingId ? { ...plan, ...planData } : plan
        )
      );
    } else {
      setPlans((previous) => [
        {
          id: crypto.randomUUID(),
          ...planData,
        },
        ...previous,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const deletePlan = (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    setPlans((previous) => previous.filter((plan) => plan.id !== id));
  };

  return (
    <div className="plans-page">
      <main className="plans-container">
        <header className="plans-header">
          <div>
            <h1>Subscription Plans</h1>
            <p>Configure subscription packages, pricing and renewal settings.</p>
          </div>

          <button className="plans-primary-btn" onClick={openCreateForm}>
            <Plus size={18} />
            Create Plan
          </button>
        </header>

        <section className="plans-stats">
          <article className="plans-stat-card">
            <span>Total Plans</span>
            <Layers size={24} className="plans-icon purple" />
            <strong>{plans.length}</strong>
          </article>

          <article className="plans-stat-card">
            <span>Average Plan Price</span>
            <IndianRupee size={24} className="plans-icon green" />
            <strong>{currency(averagePrice)}</strong>
          </article>

          <article className="plans-stat-card">
            <span>Auto Renewal Plans</span>
            <RefreshCw size={24} className="plans-icon orange" />
            <strong>{plans.filter((plan) => plan.autoRenew).length}</strong>
          </article>
        </section>

        <section className="plans-catalogue">
          <div className="plans-catalogue-heading">
            <div>
              <h2>Plan Catalogue</h2>
              <p>{plans.length} plans available in this session</p>
            </div>

            <div className="plans-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search plans or products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="plans-table-wrapper">
            <table className="plans-table">
              <thead>
                <tr>
                  <th>PLAN</th>
                  <th>PRODUCT</th>
                  <th>BILLING CYCLE</th>
                  <th>PRICE</th>
                  <th>MIN. QTY</th>
                  <th>AUTO RENEW</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <strong>{plan.name}</strong>
                      <small>
                        {plan.startDate || "No start date"}
                        {plan.endDate ? ` – ${plan.endDate}` : ""}
                      </small>
                    </td>
                    <td>{plan.productName}</td>
                    <td>
                      <span className="plans-cycle">
                        {plan.cycle}
                      </span>
                    </td>
                    <td className="plans-price">{currency(plan.price)}</td>
                    <td>{plan.minimumQuantity}</td>
                    <td>
                      <span className={plan.autoRenew ? "plans-enabled" : "plans-disabled"}>
                        {plan.autoRenew ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td>
                      <div className="plans-actions">
                        <button
                          title="Edit plan"
                          className="plans-edit-btn"
                          onClick={() => openEditForm(plan)}
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          title="Delete plan"
                          className="plans-delete-btn"
                          onClick={() => deletePlan(plan.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPlans.length === 0 && (
                  <tr>
                    <td colSpan="7">
                      <div className="plans-empty">
                        <Package size={42} />
                        <h3>{search ? "No matching plans" : "No plans yet"}</h3>
                        <p>
                          {search
                            ? "Try another search term."
                            : "Create your first subscription plan to get started."}
                        </p>
                        {!search && (
                          <button
                            className="plans-primary-btn"
                            onClick={openCreateForm}
                          >
                            <Plus size={17} />
                            Create First Plan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showForm && (
        <div className="plans-modal-overlay">
          <section
            className="plans-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="plans-modal-title"
          >
            <div className="plans-modal-header">
              <div>
                <h2 id="plans-modal-title">
                  {editingId ? "Edit Subscription Plan" : "Create Subscription Plan"}
                </h2>
                <p>Enter the plan details below.</p>
              </div>

              <button
                className="plans-close-btn"
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={savePlan}>
              <div className="plans-form-grid">
                <label>
                  Plan Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="e.g. Premium Monthly"
                    required
                  />
                </label>

                <label>
                  Product Name *
                  <input
                    name="productName"
                    value={form.productName}
                    onChange={updateField}
                    placeholder="Enter an existing product name"
                    required
                  />
                </label>

                <label>
                  Billing Cycle *
                  <select
                    name="cycle"
                    value={form.cycle}
                    onChange={updateField}
                  >
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </label>

                <label>
                  Plan Price (₹) *
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={updateField}
                    min="0.01"
                    step="0.01"
                    placeholder="999"
                    required
                  />
                </label>

                <label>
                  Minimum Quantity *
                  <input
                    type="number"
                    name="minimumQuantity"
                    value={form.minimumQuantity}
                    onChange={updateField}
                    min="1"
                    step="1"
                    required
                  />
                </label>

                <label>
                  Start Date
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={updateField}
                  />
                </label>

                <label>
                  End Date
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={updateField}
                    min={form.startDate || undefined}
                  />
                </label>
              </div>

              <label className="plans-renew-option">
                <input
                  type="checkbox"
                  name="autoRenew"
                  checked={form.autoRenew}
                  onChange={updateField}
                />
                <span>
                  <strong>Enable automatic renewal</strong>
                  <small>Allow this plan to renew automatically.</small>
                </span>
              </label>

              {error && <p className="plans-error">{error}</p>}

              <div className="plans-modal-actions">
                <button
                  type="button"
                  className="plans-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="plans-primary-btn">
                  {editingId ? "Save Changes" : "Create Plan"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
