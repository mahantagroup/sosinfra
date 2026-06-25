import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import MobileAdminNav from './components/MobileAdminNav';
import Dashboard from './sections/Dashboard';
import ProjectsSection from './sections/ProjectsSection';
import BlogsSection from './sections/BlogsSection';
import GallerySection from './sections/GallerySection';
import TeamSection from './sections/TeamSection';
import TestimonialsSection from './sections/TestimonialsSection';

import './Admin.css';

const SECTION_MAP = {
  dashboard: Dashboard,
  projects: ProjectsSection,
  blogs: BlogsSection,
  gallery: GallerySection,
  team: TeamSection,
  testimonials: TestimonialsSection,
};

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const ActiveComponent = SECTION_MAP[activeSection] || Dashboard;

  return (
    <div className="admin-main-content">
      <AdminSidebar active={activeSection} onNavigate={setActiveSection} />
      <MobileAdminNav active={activeSection} onNavigate={setActiveSection} />

      <div className="admin-content-area">
        <AdminHeader sectionId={activeSection} />
        <main className="admin-content-main">
          <div className="container-fluid px-0">
            <ActiveComponent onNavigate={setActiveSection} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
