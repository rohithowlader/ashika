import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api.js";
import AuthIllustration from "../components/AuthIllustration";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg({});
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      setMsg({ type: "success", text: "Signed in successfully." });
      navigate("/"); // change to your dashboard route
    } catch (err) {
      const text = err?.response?.data?.msg || "Invalid credentials";
      setMsg({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <AuthIllustration />
      <section className="auth-form-side">
        <div className="card">
          <h2>Sign In</h2>
          <p className="sub">
            Welcome back! Please enter your credentials to continue.
          </p>

          {msg.text && (
            <div className={msg.type === "error" ? "error" : "success"}>
              {msg.text}
            </div>
          )}

          <form className="form" onSubmit={onSubmit}>
            <div className="input">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter user name"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input">
              <label htmlFor="password">
                Password<span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="actions">
              <Link className="link" to="/forgot-password">
                Forgot Password?
              </Link>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
