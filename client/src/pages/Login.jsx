import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        backgroundColor: "#f8f9fa"
      }}
    >
      <div
        style={{
          backgroundColor: "#2c3e50",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px"
        }}
      >
        <h1 style={{ fontSize: "42px", marginBottom: "15px" }}>
          Inventory Web App
        </h1>

        <h3 style={{ fontWeight: "normal", marginBottom: "20px" }}>
          Smart Inventory. Real-Time Control.
        </h3>

        <p style={{ fontSize: "17px", lineHeight: "1.7", maxWidth: "500px" }}>
          A full-stack inventory management system designed to manage products,
          suppliers, stock movements, and low-stock monitoring efficiently in
          one centralized platform.
        </p>

        <ul style={{ marginTop: "25px", lineHeight: "2" }}>
          <li>Track products and stock levels</li>
          <li>Manage supplier information</li>
          <li>Monitor stock IN and OUT history</li>
          <li>View dashboard analytics and low-stock alerts</li>
        </ul>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px"
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            width: "100%",
            maxWidth: "380px",
            backgroundColor: "#ffffff",
            padding: "35px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}
        >
          <h2 style={{ marginBottom: "10px", color: "#2c3e50" }}>Login</h2>

          <p style={{ marginBottom: "25px", color: "#666" }}>
            Sign in to access your inventory dashboard.
          </p>

          {error && (
            <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "6px"
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "6px"
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              backgroundColor: loading ? "#7f8c8d" : "#3498db",
              color: "#ffffff",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold"
            }}
          >
            {loading ? "Logging in... please wait" : "Login"}
          </button>

          <p style={{ marginTop: "18px", textAlign: "center", color: "#555" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#3498db" }}>
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}