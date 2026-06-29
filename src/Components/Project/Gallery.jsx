import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import Breadcrumb from "./Breadcrumb";

const formatLocationSummary = (location) => {
  if (!location) return "";
  if (typeof location === "string") return location;
  return location.summary || location.address || "";
};

/* -----------------------------
   PREMIUM CUSTOM STYLE
------------------------------ */
const CustomStyles = () => (
  <style>
    {`
      :root {
        --primary: #0A2540;
        --accent: #4A97E4;
        --neutral-soft: #f8fafc;
        --border-light: #e2e8f0;
        --text-dark: #334155;
        --text-muted: #64748b;
        --radius-lg: 20px;
        --radius-md: 14px;
        --radius-sm: 10px;
        --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .premium-event-card {
        width: 100%;
        background: #fff;
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(0,0,0,0.06);
        transition: var(--transition);
        position: relative;
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(226,232,240);
      }

      .premium-event-card:hover {
        transform: translateY(-12px);
        box-shadow: 0 20px 50px rgba(0,0,0,0.12);
      }

      .premium-image-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      }

      .premium-image-wrapper img {
        width: 100%;
        height: 260px;
        object-fit: cover;
        transition: 0.5s ease;
      }

      .premium-event-card:hover .premium-image-wrapper img {
        transform: scale(1.12);
      }

      .premium-overlay-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 50%, rgba(10,37,64,0.9) 100%);
        pointer-events: none;
      }

      .premium-status-tag {
        position: absolute;
        top: 16px;
        left: 16px;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        color: var(--primary);
        padding: 8px 16px;
        border-radius: 30px;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.3px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      }

      .premium-card-body {
        padding: 22px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .premium-card-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary);
        margin: 0;
        line-height: 1.2;
      }

      .premium-card-desc {
        font-size: 0.92rem;
        color: var(--text-muted);
        line-height: 1.6;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .premium-view-btn {
        width: 100%;
        background: linear-gradient(135deg, var(--accent), var(--primary));
        color: #fff;
        border: none;
        padding: 13px 24px;
        border-radius: var(--radius-md);
        font-weight: 600;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition: var(--transition);
        margin-top: 6px;
      }

      .premium-view-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(74,151,228,0.35);
      }

      .premium-view-btn .btn-icon {
        transition: transform 0.3s ease;
      }

      .premium-view-btn:hover .btn-icon {
        transform: translateX(5px);
      }

      @media (max-width: 992px) {
        .premium-image-wrapper img {
          height: 240px;
        }
      }

      @media (max-width: 768px) {
        .premium-image-wrapper img {
          height: 220px;
        }

        .premium-card-body {
          padding: 18px 16px 20px;
        }
      }
    `}
  </style>
);

const ProjectCard = ({ project, onView }) => (
  <div className="premium-event-card">
    <div className="premium-image-wrapper">
      <img 
        src={project.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="1" y="1" width="1198" height="798" fill="none" stroke="%23e2e8f0" stroke-width="2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="%230A2540">No Image Available</text></svg>'} 
        alt={project.title} 
        onError={(e) => { 
          e.currentTarget.onerror = null; 
          e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="1" y="1" width="1198" height="798" fill="none" stroke="%23e2e8f0" stroke-width="2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="%230A2540">No Image Available</text></svg>'; 
        }} 
      />
      <div className="premium-overlay-gradient"></div>
      <div className="premium-status-tag">Running</div>
    </div>
    <div className="premium-card-body">
      <h3 className="premium-card-title">{project.title}</h3>
      <p className="premium-card-desc">{project.tagline || formatLocationSummary(project.location)}</p>
      <button className="premium-view-btn" type="button" onClick={onView}>
        View Project Details
        <span className="btn-icon">→</span>
      </button>
    </div>
  </div>
);

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const projectsRef = collection(db, "projects");
    const unsubscribe = onSnapshot(
      projectsRef,
      (snapshot) => {
        const projectData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const runningProjects = projectData.filter(
          (project) => (project.status || "running") === "running"
        );
        runningProjects.sort((a, b) => {
          const idA = a.projectId || "";
          const idB = b.projectId || "";
          if (!idA && idB) return 1;
          if (idA && !idB) return -1;
          if (!idA && !idB) return 0;
          return idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' });
        });
        setProjects(runningProjects);
        setLoading(false);
      },
      () => {
        setError("Unable to load running projects.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const stateMessage = (() => {
    if (loading) return "Loading running projects...";
    if (error) return error;
    if (projects.length === 0) return "Running projects will appear here soon.";
    return "";
  })();

  return (
    <>
      <Breadcrumb />
      <CustomStyles />

      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold fs-1">Running Project Gallery</h2>
        </div>

        {stateMessage ? (
          <div className="text-center text-muted py-5">{stateMessage}</div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {projects.map((project) => (
              <div className="col" key={project.id}>
                <ProjectCard project={project} onView={() => navigate(`/projects/${project.id}`)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;
