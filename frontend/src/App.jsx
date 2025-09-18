import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
// import NotFound from "./pages/NotFound";

// guards / shared UI
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// global styles for auth screens (optional)
import "./styles/auth.css";

export default function App() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Private (authenticated) routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Optional: alias root to /login if not using dashboard */}
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}

      {/* 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
