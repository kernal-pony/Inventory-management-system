
import { useEffect, useState } from "react";
import api from "../api/api";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  const loadSuppliers = async () => {
    try {
      const res = await api.get("/api/suppliers");
      setSuppliers(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("Failed to load suppliers:", err);
      setError(
        err.response?.data?.error || "Failed to load suppliers."
      );
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      address: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);

      if (editingId !== null) {
        await api.put(`/api/suppliers/${editingId}`, form);
        setMessage("Supplier updated successfully.");
      } else {
        await api.post("/api/suppliers", form);
        setMessage("Supplier added successfully.");
      }

      resetForm();
      await loadSuppliers();
    } catch (err) {
      console.error("Failed to save supplier:", err);
      setError(
        err.response?.data?.error || "Failed to save supplier."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplier) => {
    setMessage("");
    setError("");
    setEditingId(supplier.id);

    setForm({
      name: supplier.name,
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || ""
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!ok) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/api/suppliers/${id}`);

      if (editingId === id) {
        resetForm();
      }

      setMessage("Supplier deleted successfully.");
      await loadSuppliers();
    } catch (err) {
      console.error("Failed to delete supplier:", err);
      setError(
        err.response?.data?.error || "Failed to delete supplier."
      );
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Suppliers</h2>

      <h3>{editingId !== null ? "Edit Supplier" : "Add Supplier"}</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          name="name"
          placeholder="Supplier Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            display: "block",
            marginBottom: 10,
            padding: 10,
            width: 320
          }}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          style={{
            display: "block",
            marginBottom: 10,
            padding: 10,
            width: 320
          }}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{
            display: "block",
            marginBottom: 10,
            padding: 10,
            width: 320
          }}
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          style={{
            display: "block",
            marginBottom: 10,
            padding: 10,
            width: 320
          }}
        />

        <button
          type="submit"
          disabled={loading}
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
          {loading
            ? "Saving..."
            : editingId !== null
              ? "Update Supplier"
              : "Add Supplier"}
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
        <p style={{ color: "green", marginBottom: 15 }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red", marginBottom: 15 }}>
          {error}
        </p>
      )}

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 10
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.phone || "-"}</td>
              <td>{s.email || "-"}</td>
              <td>{s.address || "-"}</td>
              <td>
                <button
                  type="button"
                  onClick={() => handleEdit(s)}
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
                  onClick={() => handleDelete(s.id)}
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

          {suppliers.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No suppliers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
