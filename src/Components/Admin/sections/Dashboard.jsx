import React from 'react';
import { Building2, Home, Newspaper, Images, Users, BarChart3, MessageSquareQuote } from 'lucide-react';
import { useCollection, useGallery, useTeam } from '../hooks/useCollection';
import { StatCard, LoadingSpinner } from '../components/ui';
import { ADMIN_SECTIONS } from '../config/sections';

const iconMap = {
  projects: Building2,
  properties: Home,
  blogs: Newspaper,
  gallery: Images,
  team: Users,
  stats: BarChart3,
  testimonials: MessageSquareQuote,
};

const Dashboard = ({ onNavigate }) => {
  const { items: projects, loading: lp } = useCollection('projects');
  const { items: properties, loading: lpr } = useCollection('properties');
  const { items: blogs, loading: lb } = useCollection('blogs');
  const { items: gallery, loading: lg } = useGallery();
  const { items: team, loading: lt } = useTeam();
  const { items: testimonials, loading: ltm } = useCollection('testimonials');

  const loading = lp || lpr || lb || lg || lt || ltm;

  const counts = {
    projects: projects.length,
    properties: properties.length,
    blogs: blogs.length,
    gallery: gallery.length,
    team: team.length,
    testimonials: testimonials.length,
    running: projects.filter((p) => (p.status || 'running') === 'running').length,
    featured: properties.filter((p) => p.featured).length,
  };

  if (loading) return <LoadingSpinner label="Loading dashboard" />;

  return (
    <div>
      {/* Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <StatCard label="Running Projects" value={counts.running} hint={`${counts.projects} total projects`} accent="blue" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard label="Properties Listed" value={counts.properties} hint={`${counts.featured} featured`} accent="cyan" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard label="Blog Posts" value={counts.blogs} hint="Shown in Journal section" accent="pink" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard label="Gallery Items" value={counts.gallery} hint="Events & achievements" accent="purple" />
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="mb-3">
        <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '1rem' }}>
          Homepage Sections
        </h3>
        <div className="row g-3">
          {ADMIN_SECTIONS.filter((s) => s.id !== 'dashboard').map((section) => {
            const Icon = iconMap[section.id] || Building2;
            const count = counts[section.id] ?? '—';
            return (
              <div key={section.id} className="col-sm-6">
                <button
                  type="button"
                  onClick={() => onNavigate(section.id)}
                  className="admin-dashboard-nav-card"
                >
                  <div className="card-icon-wrap">
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="card-label">{section.label}</p>
                    <p className="card-sub">{section.homepage}</p>
                  </div>
                  <span className="card-count">{count}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
