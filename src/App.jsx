import React, { useState, useEffect, lazy, Suspense } from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import CustomCursor from './Components/Common/CustomCursor';
import FloatingWhatsApp from './Components/Common/FloatingWhatsApp';
import ScrollToTop from './Components/ScrollToTop';
import LazyLoader from './Components/Common/LazyLoader';

// Preloader Component
import PremiumPreloader from './Components/Homepage/Preloader';

// Layout
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';

// Fast initial mount for Home
import Home from './Components/Homepage/Home';

// Lazy-loaded routes for code-splitting & ultra fast initial load
const About = lazy(() => import('./Components/About/About'));
const Contact = lazy(() => import('./Components/Contact/Contact'));
const Gallery = lazy(() => import('./Components/Gallary/Gallery'));
const ProjectGallery = lazy(() => import('./Components/Project/Gallery'));
const PropertyListing = lazy(() => import('./Components/Property/Property'));
const BlogPage = lazy(() => import('./Components/Blog/Blog'));
const AdminPanel = lazy(() => import('./Components/Admin/AdminPanel'));
const AdminLogin = lazy(() => import('./Components/Admin/AdminLogin'));
const ProtectedAdminRoute = lazy(() => import('./Components/Admin/ProtectedAdminRoute'));
const PropertyDetail = lazy(() => import('./Components/PropertyDetail/PropertyDetail'));
const Director = lazy(() => import('./Components/About Director/Director'));
const Complete = lazy(() => import('./Components/Project/Complete'));
const ProjectDetail = lazy(() => import('./Components/Project/ProjectDetail'));
const Terms = lazy(() => import('./Components/Legal/Terms'));
const Team = lazy(() => import('./Components/About/Team'));
const Career = lazy(() => import('./Components/Careers/Career'));
const JoinAsPartner = lazy(() => import('./Components/JoinAsPartner'));
const HRDashboard = lazy(() => import('./Components/HRPanel/HRDashboard'));
const Privacy = lazy(() => import('./Components/Legal/Privacy'));
const AgentLogin = lazy(() => import('./Components/Agent panel/AgentLogin'));
const AgentPanel = lazy(() => import('./Components/Agent panel/Dashboard'));
const ProtectedAgentRoute = lazy(() => import('./Components/Agent panel/ProtectedAgentRoute'));
const ThankYou = lazy(() => import('./Components/ThankYou'));
const NotFoundPage = lazy(() => import('./Components/404/NotFound'));

import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize AOS lazily if available
    let aos;
    (async () => {
      try {
        const mod = await import('aos');
        await import('aos/dist/aos.css');
        aos = mod.default;
        aos.init({ duration: 700, easing: 'ease-out-quart', once: true, offset: 40 });
      } catch (_) {
        // AOS not installed; skip silently
      }
    })();

    const preloadAssets = async () => {
      try {
        const images = ["images/logo.png"];
        await Promise.all(
          images.map(src => {
            return new Promise((resolve) => {
              const img = new Image();
              img.src = src;
              img.onload = resolve;
              img.onerror = resolve;
            });
          })
        );
        setLoading(false);
      } catch (error) {
        console.log("Preloading error:", error);
        setLoading(false);
      }
    };

    preloadAssets();
  }, []);

  const location = useLocation();
  const hidePaths = ['/admin', '/hr-panel', '/agent', '-login', '/login'];
  const shouldHide = hidePaths.some(path => location.pathname.includes(path));

  return (
    <>
      <ScrollToTop />   
      {/* Global custom cursor */}
      <CustomCursor />
      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Main content */}
      <div className={`app-content ${loading ? "hidden-content" : "content-visible"}`}>
        {!shouldHide && <Header />}

        <Suspense fallback={<LazyLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/aboutdirector" element={<Director />} />
            <Route path="/projectgallery" element={<ProjectGallery />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/complete" element={<Complete />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/property" element={<PropertyListing />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route index element={<AdminPanel />} />
            </Route>
            <Route path="/hr-panel" element={<ProtectedAdminRoute />}>
              <Route index element={<HRDashboard />} />
            </Route>
            <Route path="/terms" element={<Terms />} />
            <Route path="/team" element={<Team />} />
            <Route path="/career" element={<Career />} />
            <Route path="/join" element={<JoinAsPartner />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/thank-you" element={<ThankYou />} />

            {/* Agent Portal */}
            <Route path="/agent/login" element={<AgentLogin />} />
            <Route path="/agent" element={<ProtectedAgentRoute />}>
              <Route index element={<Navigate to="/agent/dashboard" replace />} />
              <Route path="dashboard" element={<AgentPanel />} />
            </Route>

            {/* 404 Page Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>

        {!shouldHide && <Footer />}
      </div>
    </>
  );
}

export default App;