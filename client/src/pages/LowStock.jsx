
import { useEffect, useState } from "react";
import api from "../api/api";

export default function LowStock() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLowStockProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/products");

      const allProducts = Array.isArray(res.data) ? res.data : [];

      const lowStock = allProducts.filter(
        (p) => Number(p.quantity) <= Number(p.reorder_level)
      );

      setProducts(lowStock);
    } catch (err) {
      console.error("Failed to load low stock products:", err);

      setError(
        err.response?.data?.error || "Failed to load low stock products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLowStockProducts();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Low Stock Products</h2>

      {loading && <p>Loading low stock products...</p>}

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {!loading && !error && (
        products.length === 0 ? (
          <p>No low stock products.</p>
        ) : (
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
                <th>SKU</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Reorder Level</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>
                    {p.quantity}
                  </td>
                  <td>{p.reorder_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
