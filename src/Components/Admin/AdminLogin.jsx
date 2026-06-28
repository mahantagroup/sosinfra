import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInAdmin } from "../Firebase/authHelpers";
import { rateLimit } from "../../utils/security";
import "./Admin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Rate limiting
    if (!rateLimit('admin_login', 5, 60000)) {
       setError("Too many attempts. Please try again later.");
       return;
    }

    if (email.length > 50 || password.length > 20) {
      setError("Credentials exceed maximum length of 20 characters.");
      return;
    }

    setLoading(true);
    try {
      await signInAdmin(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      // Use generic error message to prevent enumeration
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-main-content d-flex align-items-center justify-content-center px-3" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <img src="https://res.cloudinary.com/dlsbj8nug/image/upload/v1782555285/logo_2x_vvvpyz.png" alt="SOS Infrabulls" className="mx-auto mb-3" style={{ height: '100px' }} />
          <h2 className="fw-bold text-dark mb-1">Admin Portal</h2>
          <p className="small text-muted text-center">Enter your secure credentials to proceed</p>
        </div>

        <div className="admin-stat-card p-4 p-md-5">
          <form onSubmit={onSubmit}>
            <div className="admin-form-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="admin@sos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={50}
                className="admin-input"
              />
            </div>

            <div className="admin-form-field mb-4">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={20}
                className="admin-input"
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 mb-4 rounded-3 small border-0" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-admin-primary w-100 justify-content-center py-3"
            >
              {loading ? "Authenticating..." : "Sign In to Portal"}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-decoration-none small text-muted">
            <span className="me-1">←</span> Back to main website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
