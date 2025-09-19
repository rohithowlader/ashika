import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className={`sb ${open ? "open" : ""}`}>
      <div className="sb-head">
        <div className="logo">sai</div>
        <button className="sb-close" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>

      <nav className="sb-nav">
        <Link
          className={`sb-link ${isActive("/dashboard") ? "active" : ""}`}
          to="/"
        >
          Dashboard
        </Link>
        <Link
          className={`sb-link ${isActive("/revenue") ? "active" : ""}`}
          to="/revenue"
        >
          Revenue Analysis
        </Link>
        <Link
          className={`sb-link ${isActive("/revenue/new") ? "active" : ""}`}
          to="/revenue/new"
        >
          + Add Entry
        </Link>
        <Link
          className={`sb-link ${isActive("/client") ? "active" : ""}`}
          to="/client"
        >
          Client Management
        </Link>
        <Link
          className={`sb-link ${isActive("/activity") ? "active" : ""}`}
          to="/activity"
        >
          Client Activity
        </Link>

        {/* ✅ New link for Details page */}
        <Link
          className={`sb-link ${isActive("/details") ? "active" : ""}`}
          to="/details"
        >
          Details
        </Link>

        <Link
          className={`sb-link ${isActive("/do-dont") ? "active" : ""}`}
          to="/do-dont"
        >
          Do & Don’t
        </Link>
        <Link
          className={`sb-link ${isActive("/change-format") ? "active" : ""}`}
          to="/change-format"
        >
          Change Format
        </Link>

        {/* Logout button */}
        <button
          className="btn danger"
          style={{ marginTop: 12 }}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
