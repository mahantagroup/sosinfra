import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Loader2, Eye, EyeOff } from 'lucide-react';
import { signInAgent } from '../Firebase/agentHelpers';
import { rateLimit } from '../../utils/security';
import './AgentPanel.css';

const AgentLogin = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Rate limiting
    if (!rateLimit('agent_login', 5, 60000)) {
      setError("Too many attempts. Please try again later.");
      return;
    }

    if (loginId.length > 50 || password.length > 20) {
      setError("Credentials exceed maximum length of 20 characters.");
      return;
    }

    setLoading(true);

    try {
      await signInAgent(loginId, password);
      navigate('/agent/dashboard');
    } catch (err) {
      // Use generic error message to prevent enumeration
      setError('Invalid login ID or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agent-portal-wrapper align-items-center justify-content-center px-4">
      <div className="w-100" style={{ maxWidth: '420px' }}>
        <div className="text-center mb-5">
          <img
            src="/images/logo/logo@2x.png"
            alt="SOS Infrabulls "
            className="mb-4 mx-auto"
            style={{ height: '100px', width: 'auto' }}
          />
          <h1 className="fw-800 mb-2" style={{ color: '#0A2540', fontSize: '1.75rem' }}>Agent Portal</h1>
          <p className="text-muted small text-center">Access your partner portal and personalized tools</p>
        </div>

        <div className="agent-card p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger border-0 small mb-4" style={{ background: '#fff5f5', color: '#c53030' }}>
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="small fw-700 text-muted mb-2 d-block text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                Agent Login ID
              </label>
              <input
                type="email"
                className="agent-input"
                placeholder="registered@email.com"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                maxLength={50}
              />
            </div>

            <div className="mb-4">
              <label className="small fw-700 text-muted mb-2 d-block text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                Your Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="agent-input pe-5"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn border-0 position-absolute end-0 top-50 translate-middle-y text-muted px-3"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-100 py-3 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2"
              style={{ background: '#4A97E4', color: 'white', borderRadius: '12px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Access Portal</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-muted mt-4" style={{ fontSize: '0.75rem' }}>
          Credentials were sent via email after your HR approval.
          <br />
          <Link to="/" className="text-decoration-none mt-3 d-inline-block fw-600 text-primary">← Back to main website</Link>
        </p>
      </div>
    </div>
  );
};

export default AgentLogin;
