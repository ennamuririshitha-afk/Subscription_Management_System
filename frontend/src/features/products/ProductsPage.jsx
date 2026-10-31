
import React, { useMemo, useState } from "react";
import "./ProductsPage.css";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  X,
  IndianRupee,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: "",
    type: "",
    salesPrice: "",
    costPrice: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      `${product.name} ${product.type}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const salesPrice = Number(form.salesPrice);
    const costPrice = Number(form.costPrice);

    if (
      form.name.trim().length < 2 ||
      form.salesPrice === "" ||
      form.costPrice === "" ||
      !Number.isFinite(salesPrice) ||
      !Number.isFinite(costPrice) ||
      salesPrice <= 0 ||
      costPrice < 0
    ) {
      alert("Enter a valid product name and prices.");
      return;
    }

    const productData = {
      ...form,
      name: form.name.trim(),
      salesPrice,
      costPrice,
    };

    if (editingId) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingId
            ? { ...product, ...productData }
            : product
        )
      );
    } else {
      setProducts((previous) => [
        {
          id: crypto.randomUUID(),
          ...productData,
        },
        ...previous,
      ]);
    }

    closeForm();
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      type: product.type || "",
      salesPrice: String(product.salesPrice),
      costPrice: String(product.costPrice),
      description: product.description || "",
    });
    setShowForm(true);
  };

  const deleteProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setProducts((previous) =>
      previous.filter((product) => product.id !== id)
    );
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  return (
    <div className="min-h-screen bg-slate-50 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Products
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your products and pricing information.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={19} />
            Add Product
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total Products</p>
              <Package className="text-indigo-600" />
            </div>
            <h2 className="mt-3 text-3xl font-bold text-slate-800">
              {products.length}
            </h2>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Average Selling Price</p>
              <IndianRupee className="text-emerald-600" />
            </div>
            <h2 className="mt-3 text-3xl font-bold text-slate-800">
              {currency(
                products.length
                  ? products.reduce((sum, p) => sum + p.salesPrice, 0) /
                      products.length
                  : 0
              )}
            </h2>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Product Categories</p>
              <Package className="text-orange-500" />
            </div>
            <h2 className="mt-3 text-3xl font-bold text-slate-800">
              {new Set(products.map((p) => p.type).filter(Boolean)).size}
            </h2>
          </div>
        </div>

        {/* Product list */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Product Catalogue
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {products.length} products available in this session
              </p>
            </div>

            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500 sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Selling Price</th>
                  <th className="px-5 py-4">Cost Price</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {product.name}
                      </p>
                      <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                        {product.description}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {product.type || "—"}
                    </td>

                    <td className="px-5 py-4 font-medium text-emerald-700">
                      {currency(product.salesPrice)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {currency(product.costPrice)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => editProduct(product)}
                          title="Edit product"
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          title="Delete product"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-16 text-center">
                      <Package
                        size={42}
                        className="mx-auto mb-3 text-slate-300"
                      />
                      <p className="font-semibold text-slate-600">
                        {search ? "No matching products" : "No products yet"}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {search
                          ? "Try another search."
                          : "Add your first product to get started."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div className="my-6 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {editingId ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter your product details.
                  </p>
                </div>

                <button
                  onClick={closeForm}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={21} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Product Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    minLength="2"
                    placeholder="Enter product name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Product Type
                  </label>
                  <input
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="e.g. Software, Service"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Selling Price (₹) *
                    </label>
                    <input
                      name="salesPrice"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.salesPrice}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Cost Price (₹) *
                    </label>
                    <input
                      name="costPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.costPrice}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe your product..."
                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    {editingId ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
