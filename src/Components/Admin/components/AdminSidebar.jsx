import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ExternalLink, Users } from 'lucide-react';
import { ADMIN_SECTIONS } from '../config/sections';

const AdminSidebar = ({ active, onNavigate }) => (
  <aside className="admin-sidebar d-none d-lg-flex">
    <div className="sidebar-brand">
      <div className="d-flex flex-column align-items-center gap-3">
        <img src="https://res.cloudinary.com/dlsbj8nug/image/upload/v1782555285/logo_2x_vvvpyz.png" alt="SOS Infrabulls" className="sidebar-brand-logo" />
        <div className="text-center">
          <p className="sidebar-brand-label mb-0">Admin Panel</p>
        </div>
      </div>
    </div>

    <nav className="sidebar-nav">
      {ADMIN_SECTIONS.map(({ id, label, icon: Icon, homepage }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <span className="d-block">{label}</span>
              {homepage && id !== 'dashboard' && (
                <span className="nav-meta">{homepage}</span>
              )}
            </div>
            {isActive && <span className="nav-active-dot" />}
          </button>
        );
      })}
    </nav>

    <div className="sidebar-footer">
      <Link to="/hr-panel" className="sidebar-nav-btn">
        <Users size={16} />
        <span>HR Panel</span>
      </Link>
      <Link to="/" className="sidebar-nav-btn">
        <ExternalLink size={16} />
        <span>View Website</span>
      </Link>
      <button
        type="button"
        onClick={() => (window.location.href = '/')}
        className="sidebar-nav-btn danger-link"
      >
        <LogOut size={16} />
        <span>Exit Admin</span>
      </button>
    </div>
  </aside>
);

export default AdminSidebar;
