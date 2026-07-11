import React, { useState, useEffect } from 'react';
import { getSection } from '../config/sections';

const SECTION_DESCRIPTIONS = {
  dashboard: 'Overview of all homepage content',
  projects: 'Manage running and completed developments shown on the website.',
  blogs: 'Publish, edit, and keep insights updated in the Journal.',
  gallery: 'Manage event photographs, achievements, and gallery items.',
  team: 'Maintain directory of corporate team members and directors.',
  testimonials: 'Add and edit client video testimonials and reviews.',
};

const AdminHeader = ({ sectionId }) => {
  const section = getSection(sectionId);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!section) return null;

  const SectionIcon = section.icon;
  const description = SECTION_DESCRIPTIONS[section.id] || section.description;

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        {SectionIcon && (
          <div className="admin-header-icon-wrapper">
            <SectionIcon size={18} strokeWidth={2.2} />
          </div>
        )}
        <div className="header-info">
          <p className="header-overline">SOS Infrabulls</p>
          <h1 className="header-title">{section.label}</h1>
          <div className="header-sub-wrapper">
            {description && (
              <p className="header-subtitle">{description}</p>
            )}
            {description && section.homepage && (
              <span className="text-secondary opacity-50" style={{ fontSize: '0.8rem' }}>•</span>
            )}
            {section.homepage && (
              <span className="header-homepage-tag">
                {section.homepage}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="d-none d-lg-flex flex-column align-items-end text-end me-1">
          <span className="font-monospace fw-bold text-dark" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-muted" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
            {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="live-badge d-none d-md-flex align-items-center">
          <span className="sync-dot me-1" />
          <span>Sync Active</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

