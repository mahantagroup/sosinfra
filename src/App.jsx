import React, { useState, useEffect } from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import ThankYou from './Components/ThankYou';
import CustomCursor from './Components/Common/CustomCursor';
import FloatingWhatsApp from './Components/Common/FloatingWhatsApp';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import NotFoundPage from './Components/404/NotFound';
import ScrollToTop from './Components/ScrollToTop';
// Preloader Component
import PremiumPreloader from './Components/Homepage/Preloader';

// Layout
import "@fortawesome/fontawesome-free/css/all.min.css";

import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';

// Pages
import Home from './Components/Homepage/Home';
import About from './Components/About/About';
import Contact from './Components/Contact/Contact';
import Gallery from './Components/Gallary/Gallery';
import ProjectGallery from './Components/Project/Gallery'
import PropertyListing from "./Components/Property/Property";
import BlogPage from "./Components/Blog/Blog";
import AdminPanel from './Components/Admin/AdminPanel';
import AdminLogin from './Components/Admin/AdminLogin';
import ProtectedAdminRoute from './Components/Admin/ProtectedAdminRoute';
import PropertyDetail from './Components/PropertyDetail/PropertyDetail';
import Director from './Components/About Director/Director';
import Complete from './Components/Project/Complete';
import ProjectDetail from './Components/Project/ProjectDetail';
import Terms from './Components/Legal/Terms';
import Team from './Components/About/Team';
import Career from './Components/Careers/Career';
import JoinAsPartner from './Components/JoinAsPartner';
import HRDashboard from './Components/HRPanel/HRDashboard';
import Privacy from './Components/Legal/Privacy';
import AgentLogin from './Components/Agent panel/AgentLogin';
import AgentPanel from './Components/Agent panel/Dashboard';
import ProtectedAgentRoute from './Components/Agent panel/ProtectedAgentRoute';
import "./App.css"

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
        const images = [
          "https://res.cloudinary.com/dlsbj8nug/image/upload/v1782555285/logo_2x_vvvpyz.png",
         
        ];

        await Promise.all(
          images.map(src => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = src;
              img.onload = resolve;
              img.onerror = resolve; // ignore errors so app never hangs
            });
          })
        );

        // Smooth delay for premium feel
        setTimeout(() => setLoading(false), 500);

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
      {/* Preloader */}
      {/* {loading && <PremiumPreloader />} */}

      {/* Main content hidden until preloader finishes */}
      <div className={`app-content ${loading ? "hidden-content" : "content-visible"}`}>

        {!shouldHide && <Header />}

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

        {!shouldHide && <Footer />}

      </div>
    </>
  );
}

export default App