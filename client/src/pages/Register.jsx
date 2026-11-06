
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff"
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

    try {
      await api.post("/api/auth/register", form);

      setMessage("Registration successful. Please login.");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      setError(
        err?.response?.data?.error || "Registration failed"
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Register
        </button>
      </form>

      {message && (
        <p style={{ color: "green", marginTop: 10 }}>{message}</p>
      )}

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>{error}</p>
      )}

      <p style={{ marginTop: 15 }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}
