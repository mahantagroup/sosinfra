import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUpAdmin } from "../Firebase/authHelpers";
import { Eye, EyeOff } from "lucide-react";
import "./Admin.css";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (email.length > 50 || password.length > 20) {
      setError("Credentials exceed maximum length of 20 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signUpAdmin(email, password);
      setSuccess("Admin created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/admin-login", { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-main-content d-flex align-items-center justify-content-center px-3" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <img src="https://res.cloudinary.com/dlsbj8nug/image/upload/v1782555285/logo_2x_vvvpyz.png" alt="SOS Infrabulls" className="mx-auto mb-3" style={{ height: '100px' }} />
          <h2 className="fw-bold text-dark mb-1">Admin Signup</h2>
          <p className="small text-muted text-center">Create a new secure admin account (TEMPORARY)</p>
        </div>

        <div className="admin-stat-card p-4 p-md-5">
          <form onSubmit={onSubmit}>
            <div className="admin-form-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="newadmin@sos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={50}
                className="admin-input"
              />
            </div>

            <div className="admin-form-field mb-4">
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  maxLength={20}
                  className="admin-input"
                  style={{ paddingRight: "45px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--admin-text-muted)",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px"
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 mb-4 rounded-3 small border-0" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success py-2 px-3 mb-4 rounded-3 small border-0" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-admin-primary w-100 justify-content-center py-3"
            >
              {loading ? "Creating..." : "Create Admin Account"}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <Link to="/admin-login" className="text-decoration-none small text-muted">
            <span className="me-1">←</span> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
