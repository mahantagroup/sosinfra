import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/Firebase";

const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
    <div style={{
      width: 50,
      height: 50,
      border: "4px solid rgba(74, 151, 228, 0.1)",
      borderTopColor: "#4A97E4",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ProtectedAgentRoute = () => {
  const [state, setState] = useState({ checking: true, user: null });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setState({ checking: false, user });
    });
    return () => unsub();
  }, []);

  if (state.checking) return <Spinner />;
  
  if (!state.user) {
    return <Navigate to="/agent/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedAgentRoute;
