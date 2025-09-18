import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// very simple auth check — customize as needed
const isAuthed = () => !!localStorage.getItem("token");

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  console.log("User authenticated:", isAuthed()); // true/false

  if (!isAuthed()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
