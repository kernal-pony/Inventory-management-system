import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);

  const loadDashboardData = async () => {
    try {
      const productsRes = await api.get("/api/products");
      const historyRes = await api.get("/api/stock/history");

      setProducts(productsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + Number(p.quantity), 0);
  const lowStockItems = products.filter(
    (p) => Number(p.quantity) <= Number(p.reorder_level)
  );

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          padding: 30
        }}
      >
        <h2 style={{ marginBottom: 25, color: "#2c3e50" }}>Dashboard</h2>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginBottom: 35
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: 20,
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          >
            <h3 style={{ marginBottom: 10, color: "#555" }}>Total Products</h3>
            <p style={{ fontSize: 28, fontWeight: "bold", color: "#2c3e50" }}>
              {totalProducts}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: 20,
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          >
            <h3 style={{ marginBottom: 10, color: "#555" }}>
              Total Stock Quantity
            </h3>
            <p style={{ fontSize: 28, fontWeight: "bold", color: "#27ae60" }}>
              {totalQuantity}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: 20,
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          >
            <h3 style={{ marginBottom: 10, color: "#555" }}>Low Stock Items</h3>
            <p style={{ fontSize: 28, fontWeight: "bold", color: "#e74c3c" }}>
              {lowStockItems.length}
            </p>
          </div>
        </div>

        {/* Low Stock Section */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            marginBottom: 30
          }}
        >
          <h3 style={{ marginBottom: 15, color: "#2c3e50" }}>
            Low Stock Products
          </h3>

          {lowStockItems.length === 0 ? (
            <p style={{ color: "#666" }}>No low stock items.</p>
          ) : (
            <table
              border="1"
              cellPadding="10"
              style={{
                width: "100%",
                borderCollapse: "collapse"
              }}
            >
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#2c3e50", color: "#fff" }}>SKU</th>
                  <th style={{ backgroundColor: "#2c3e50", color: "#fff" }}>Name</th>
                  <th style={{ backgroundColor: "#2c3e50", color: "#fff" }}>Quantity</th>
                  <th style={{ backgroundColor: "#2c3e50", color: "#fff" }}>Reorder Level</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td style={{ color: "#000" }}>{item.sku}</td>
                    <td style={{ color: "#000" }}>{item.name}</td>
                    <td style={{ color: "#e74c3c", fontWeight: "bold" }}>
                      {item.quantity}
                    </td>
                    <td style={{ color: "#000" }}>{item.reorder_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* History Section */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >
          <h3 style={{ marginBottom: 15, color: "#2c3e50" }}>
            Recent Stock Movements
          </h3>

          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr>
                <th style={{ backgroundColor: "#2c3e50", color: "#fff" }}>Product</th>
                <th style={{ backgroundColor: "#2c3e50", color: "#fff" }}>SKU</th>
                <th style={{ backgroundColor: "#2c3e50", color: "#fff" }}>Type</th>
                <th style={{ backgroundColor: "#2c3e50", color: "#fff" }}>Qty</th>
                <th style={{ backgroundColor: "#2c3e50", color: "#fff" }}>Note</th>
                <th style={{ backgroundColor: "#2c3e50", color: "#fff" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 5).map((item) => (
                <tr key={item.id}>
                  <td style={{ color: "#000" }}>{item.name}</td>
                  <td style={{ color: "#000" }}>{item.sku}</td>
                  <td
                    style={{
                      color: item.type === "IN" ? "#27ae60" : "#e74c3c",
                      fontWeight: "bold"
                    }}
                  >
                    {item.type}
                  </td>
                  <td style={{ color: "#000" }}>{item.qty}</td>
                  <td style={{ color: "#000" }}>{item.note}</td>
                  <td style={{ color: "#000" }}>
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}