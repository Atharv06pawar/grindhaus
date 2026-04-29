import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import GlobalLoader from "./GlobalLoader";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <GlobalLoader label="Restoring session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
