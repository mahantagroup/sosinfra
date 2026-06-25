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
   CUSTOM STYLE
------------------------------ */
const CustomStyles = () => (
  <style>
    {`
      .event-card {
        width: 100%;
        height: 380px;
        border-radius: var(--radius);
        overflow: hidden;
        background: #fff;
        display: flex;
        flex-direction: column;
        box-shadow: 0 12px 40px rgba(0,0,0,0.12);
        transition: 0.3s ease;
        position: relative;
      }

      .event-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 18px 55px rgba(0,0,0,0.18);
      }

      .image-wrapper {
        height: 390px;
        position: relative;
        overflow: hidden;
      }

      .image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: 0.4s ease;
        transform: scale(1.08);
      }

      .event-card:hover .image-wrapper img {
        transform: scale(1.18);
      }

      .category-tag {
        position: absolute;
        top: 14px;
        right: 14px;
        padding: 6px 14px;
        font-size: 0.75rem;
        background: rgba(255,255,255,0.55);
        backdrop-filter: blur(8px);
        border-radius: 30px;
        color: #000;
        font-weight: 600;
      }

      .overlay-info {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 20px 18px;
        background: linear-gradient(180deg, transparent, rgba(0,0,0,0.85));
        color: white;
      }

      .overlay-title {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0;
        color: white;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .date-box {
        display: inline-block;
        background: rgba(255,255,255,0.9);
        color: var(--primary);
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 0.8rem;
        margin-bottom: 6px;
        font-weight: 600;
      }

      .card-body {
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 170px;
      }

      .desc {
        font-size: 0.87rem;
        color: #555;
        line-height: 1.5;
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .btn-view {
        background: var(--primary);
        color: white;
        border: none;
        padding: 12px 0;
        border-radius: 12px;
        font-weight: 600;
        transition: 0.3s ease;
      }

      .btn-view:hover {
        background: #08408a;
        transform: translateY(-3px);
      }
        .premium-btn {
  background: linear-gradient(135deg, #0f5fc0, #0a3e84);
  color: #fff;
  border: none;
  padding: 12px 0;
  border-radius: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  box-shadow: 0 8px 20px rgba(15, 95, 192, 0.35);
  transition: 0.35s ease;
}

.premium-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(15, 95, 192, 0.45);
}

.premium-btn .arrow {
  transition: 0.35s ease;
  font-size: 1rem;
}

.premium-btn:hover .arrow {
  transform: translateX(6px);
}


      @media (max-width: 768px) {
        .event-card { height: 360px; }
        .image-wrapper { height: 390px; }
      }
    `}
  </style>
);

const ProjectCard = ({ project, onView }) => (
  <div className="event-card">
    <div className="image-wrapper">
      <img src={project.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23ffffff"/><rect x="1" y="1" width="1198" height="798" fill="none" stroke="%23000" stroke-width="2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="%23000">No Image Available</text></svg>'} alt={project.title} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23ffffff"/><rect x="1" y="1" width="1198" height="798" fill="none" stroke="%23000" stroke-width="2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="%23000">No Image Available</text></svg>'; }} />
      <div className="overlay-info">
        <h4 className="overlay-title">{project.title}</h4>
      </div>
    </div>
    <div className="card-body">
      <p className="desc">{project.tagline || formatLocationSummary(project.location)}</p>
      <button className="btn-view premium-btn" type="button" onClick={onView}>
        View Project Details
        <span className="arrow">→</span>
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
          <p className="text-muted fs-5">
            {/* Explore every ongoing milestone curated by SOS Infrabulls. */}
          </p>
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
