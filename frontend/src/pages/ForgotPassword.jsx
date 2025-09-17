import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthIllustration from "../components/AuthIllustration";
import "../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg({});
    setLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      setMsg({ type: "success", text: "Reset link sent! Check your email." });
    } catch (err) {
      const text = err?.response?.data?.msg || "Unable to send email";
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
          <h2>Reset Password</h2>
          <p className="sub">
            Enter your email address and we’ll send you a link to reset your
            password.
          </p>

          {msg.text && (
            <div className={msg.type === "error" ? "error" : "success"}>
              {msg.text}
            </div>
          )}

          <form className="form" onSubmit={onSubmit}>
            <div className="input">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="actions">
              <Link className="link" to="/login">
                Sign in
              </Link>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Sending..." : "Send To Email"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
