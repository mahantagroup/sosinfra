import React from 'react';
import { X } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="admin-spinner-wrap">
    <div className="admin-spinner" />
    <p>{label}</p>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="admin-empty-state">
    {Icon && (
      <div className="empty-icon-wrap">
        <Icon size={20} />
      </div>
    )}
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {action && <div className="empty-action">{action}</div>}
  </div>
);

export const StatCard = ({ label, value, hint, accent = 'blue' }) => (
  <article className="admin-stat-card">
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
    {hint && <p className="stat-hint">{hint}</p>}
    <div className={`stat-bar stat-bar-${accent}`} />
  </article>
);

export const Badge = ({ children, variant = 'default' }) => (
  <span className={`admin-badge admin-badge-${variant}`}>
    {children}
  </span>
);

export const BtnPrimary = ({ children, onClick, type = 'button', disabled, className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`btn-admin-primary ${className}`}
  >
    {children}
  </button>
);

export const BtnGhost = ({ children, onClick, type = 'button', className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`btn-admin-ghost ${className}`}
  >
    {children}
  </button>
);

export const BtnDanger = ({ children, onClick, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className="btn-admin-danger"
  >
    {children}
  </button>
);

export const Modal = ({ open, onClose, title, subtitle, children, wide }) => {
  if (!open) return null;
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className={`admin-modal ${wide ? 'admin-modal-wide' : 'admin-modal-default'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <h3>{title}</h3>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X size={16} />
          </button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
};

export const FormField = ({ label, required, hint, children }) => (
  <div className="admin-form-field">
    <label>
      {label}{required && <span className="required-star">*</span>}
    </label>
    {children}
    {hint && <p className="form-hint">{hint}</p>}
  </div>
);

export const inputClass = 'admin-input';
export const textareaClass = 'admin-input';

export const ProgressBar = ({ progress, label }) => (
  <div className="admin-progress-wrap">
    <div className="admin-progress-track">
      <div className="admin-progress-fill" style={{ width: `${progress}%` }} />
    </div>
    {label && <p className="admin-progress-label">{label} {progress}%</p>}
  </div>
);

export const SectionHeader = ({ title, subtitle, homepage, action }) => (
  <div className="admin-section-header">
    <div>
      <h2>{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      {homepage && <p className="section-homepage-tag">Homepage: {homepage}</p>}
    </div>
    {action}
  </div>
);

export const ListRow = ({ image, title, meta, badges, actions }) => (
  <li className="admin-list-row">
    {image && (
      <div className="list-thumb">
        <img src={image} alt="" />
      </div>
    )}
    <div className="list-info">
      <p className="list-title">{title}</p>
      {meta && <p className="list-meta">{meta}</p>}
      {badges && <div className="list-badges">{badges}</div>}
    </div>
    {actions && <div className="list-actions">{actions}</div>}
  </li>
);
