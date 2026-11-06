
import { useEffect, useState } from "react";
import api from "../api/api";

export default function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/stock/history");

      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load stock history:", err);

      setError(
        err.response?.data?.error || "Failed to load stock history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Stock History</h2>

      {loading && <p>Loading stock history...</p>}

      {error && (
        <p style={{ color: "red", marginTop: 15 }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 20
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>SKU</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Note</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.sku}</td>
                <td
                  style={{
                    color: item.type === "IN" ? "green" : "red",
                    fontWeight: "bold"
                  }}
                >
                  {item.type}
                </td>
                <td>{item.qty}</td>
                <td>{item.note || "-"}</td>
                <td>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}

            {history.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No stock movements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
