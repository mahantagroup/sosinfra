import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { listenAuth } from "../Firebase/authHelpers";

const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
    <div style={{
      width: 50,
      height: 50,
      border: "4px solid rgba(148, 163, 184, 0.25)",
      borderTopColor: "#64748b",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ProtectedAdminRoute = () => {
  const [state, setState] = useState({ checking: true, user: null, allowed: false });

  useEffect(() => {
    const unsub = listenAuth((user) => {
      setState({ checking: false, user, allowed: !!user });
    });
    return () => unsub();
  }, []);

  if (state.checking) return <Spinner />;
  
  if (!state.user) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedAdminRoute;

