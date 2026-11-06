
import { useEffect, useState } from "react";
import api from "../api/api";

export default function StockOut() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    product_id: "",
    qty: "",
    note: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Failed to load products.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (Number(form.qty) <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/stock/out", {
        product_id: Number(form.product_id),
        qty: Number(form.qty),
        note: form.note
      });

      setMessage("Stock removed successfully!");

      setForm({
        product_id: "",
        qty: "",
        note: ""
      });

      await loadProducts();
    } catch (err) {
      console.error("Failed to remove stock:", err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to remove stock."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Stock OUT</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>Product</label>

        <select
          name="product_id"
          value={form.product_id}
          onChange={handleChange}
          required
          style={{
            display: "block",
            width: "100%",
            padding: 10,
            marginBottom: 10
          }}
        >
          <option value="">Select Product</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku}) - Current Qty: {p.quantity}
            </option>
          ))}
        </select>

        <label>Quantity</label>

        <input
          type="number"
          name="qty"
          value={form.qty}
          onChange={handleChange}
          min="1"
          step="1"
          required
          style={{
            display: "block",
            width: "100%",
            padding: 10,
            marginBottom: 10
          }}
        />

        <label>Note</label>

        <input
          type="text"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Optional note"
          style={{
            display: "block",
            width: "100%",
            padding: 10,
            marginBottom: 10
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Processing..." : "Remove Stock"}
        </button>
      </form>

      {message && (
        <p style={{ color: "green", marginTop: 15 }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red", marginTop: 15 }}>
          {error}
        </p>
      )}
    </div>
  );
}
