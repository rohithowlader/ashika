import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthIllustration from "../components/AuthIllustration";
import "../styles/auth.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm)
      return setMsg({ type: "error", text: "Passwords do not match." });
    setMsg({});
    setLoading(true);
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setMsg({
        type: "success",
        text: "Password updated! Redirecting to Sign in...",
      });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const text = err?.response?.data?.msg || "Invalid or expired link";
      setMsg({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <AuthIllustration headline="One Click To go All Digital" />
      <section className="auth-form-side">
        <div className="card">
          <h2>Create New Password</h2>
          <p className="sub">
            Choose a strong password you don’t use elsewhere.
          </p>

          {msg.text && (
            <div className={msg.type === "error" ? "error" : "success"}>
              {msg.text}
            </div>
          )}

          <form className="form" onSubmit={onSubmit}>
            <div className="input">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <div className="input">
              <label htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                placeholder="Re-enter new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <div className="actions">
              <Link className="link" to="/login">
                Back to Sign in
              </Link>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
