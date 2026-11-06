
import { useEffect, useState } from "react";
import api from "../api/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    sku: "",
    name: "",
    price: "",
    quantity: "",
    reorder_level: ""
  });

  const [editingId, setEditingId] = useState(null);

  const loadProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (error) {
      console.error("Failed to load products:", error);
      setError(
        error.response?.data?.error || "Failed to load products."
      );
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      sku: "",
      name: "",
      price: "",
      quantity: "",
      reorder_level: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        sku: form.sku,
        name: form.name,
        category_id: null,
        price: Number(form.price),
        quantity: Number(form.quantity),
        reorder_level: Number(form.reorder_level)
      };

      if (editingId !== null) {
        await api.put(`/api/products/${editingId}`, payload);
        setMessage("Product updated successfully.");
      } else {
        await api.post("/api/products", payload);
        setMessage("Product added successfully.");
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
      setError(
        error.response?.data?.error || "Failed to save product."
      );
    }
  };

  const handleEdit = (product) => {
    setMessage("");
    setError("");
    setEditingId(product.id);

    setForm({
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      reorder_level: product.reorder_level
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!ok) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/api/products/${id}`);

      if (editingId === id) {
        resetForm();
      }

      setMessage("Product deleted successfully.");
      await loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      setError(
        error.response?.data?.error || "Failed to delete product."
      );
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.sku || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>

      <h3>{editingId !== null ? "Edit Product" : "Add Product"}</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: 10, padding: 10, width: 300 }}
        />

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: 10, padding: 10, width: 300 }}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          style={{ display: "block", marginBottom: 10, padding: 10, width: 300 }}
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          min="0"
          required
          style={{ display: "block", marginBottom: 10, padding: 10, width: 300 }}
        />

        <input
          type="number"
          name="reorder_level"
          placeholder="Reorder Level"
          value={form.reorder_level}
          onChange={handleChange}
          min="0"
          required
          style={{ display: "block", marginBottom: 10, padding: 10, width: 300 }}
        />

        <button
          type="submit"
          style={{
            padding: "8px 14px",
            marginRight: 10,
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {editingId !== null ? "Update Product" : "Add Product"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: "8px 14px",
              border: "none",
              backgroundColor: "#7f8c8d",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {message && (
        <p style={{ color: "green", marginBottom: 15, fontWeight: "500" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red", marginBottom: 15, fontWeight: "500" }}>
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Search by name or SKU..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 10,
          marginBottom: 20,
          width: "300px"
        }}
      />

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px"
        }}
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>ID</th>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>SKU</th>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>Name</th>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>Price</th>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>Quantity</th>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>Reorder Level</th>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>{p.reorder_level}</td>
              <td>
                <button
                  type="button"
                  onClick={() => handleEdit(p)}
                  style={{
                    marginRight: 8,
                    padding: "8px 14px",
                    border: "none",
                    backgroundColor: "#3498db",
                    color: "white",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  style={{
                    padding: "8px 14px",
                    border: "none",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredProducts.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
