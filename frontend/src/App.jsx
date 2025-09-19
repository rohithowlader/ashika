import React from "react";
import { Routes, Route } from "react-router-dom";

// auth pages (yours)
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import RevenueLedgerList from "./pages/RevenueLedgerList";
import RevenueLedgerCreate from "./pages/RevenueLedgerCreate";
import ClientDetails from "./pages/ClientDetails";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/ledger.css";
import "./styles/auth.css";

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* private */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/revenue"
        element={
          <ProtectedRoute>
            <RevenueLedgerList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/revenue/new"
        element={
          <ProtectedRoute>
            <RevenueLedgerCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/details"
        element={
          <ProtectedRoute>
            <ClientDetails />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
