import React from 'react';
import { getSection } from '../config/sections';

const AdminHeader = ({ sectionId }) => {
  const section = getSection(sectionId);
  if (!section) return null;

  return (
    <header className="admin-header">
      <div>
        <p className="header-overline">SOS Infrabulls</p>
        <h1 className="header-title">{section.label}</h1>
        {section.description && (
          <p className="header-subtitle">{section.description}</p>
        )}
        {section.homepage && (
          <p className="header-subtitle">
            Powers the <strong style={{ color: 'var(--admin-text)' }}>{section.homepage}</strong> section on the homepage
          </p>
        )}
      </div>
      <div className="live-badge d-none d-md-flex">
        <span className="sync-dot" />
        <span>Live sync</span>
      </div>
    </header>
  );
};

export default AdminHeader;
