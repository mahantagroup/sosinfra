import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { 
    FaArrowLeft, 
    FaMapMarkerAlt, 
    FaFilePdf, 
    FaDownload, 
    FaBuilding, 
    FaThLarge, 
    FaLocationArrow, 
    FaCheckCircle, 
    FaStar, 
    FaPhoneAlt, 
    FaArrowRight 
} from "react-icons/fa";
import "./ProjectDetail.css";

const formatLocationSummary = (location) => {
    if (!location) return "";
    if (typeof location === "string") return location;
    return location.summary || location.address || "";
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

const collectPricingTypes = (pricing = {}) => {
    const buckets = new Set();
    ["rate_per_sqft", "electricity_charge", "maintenance", "prime_location_charges", "plot_size_sqft"].forEach(
        (key) => {
            const group = pricing[key];
            if (group && typeof group === "object") {
                Object.keys(group).forEach((type) => buckets.add(type));
            }
        }
    );
    return Array.from(buckets);
};

const ProjectDetail = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;
            try {
                const docRef = doc(db, "projects", projectId);
                const snapshot = await getDoc(docRef);
                if (!snapshot.exists()) {
                    setError("The requested project was not found.");
                } else {
                    setProject({ id: snapshot.id, ...snapshot.data() });
                }
            } catch (err) {
                setError("Unable to load project details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    // ✅ MOVE HOOKS BEFORE ANY CONDITIONAL RETURN
    const pricing = project?.pricing || {};
    const pricingTypes = useMemo(() => collectPricingTypes(pricing), [pricing]);

    const configurations = project?.configurations || {};
    const configurationEntries = Object.entries(configurations);

    const advantages = safeArray(project?.location?.advantages);
    const amenities = safeArray(project?.amenities);

    // ❗ CONDITIONAL RETURNS MUST COME AFTER ALL HOOKS
    if (loading) {
        return <div className="project-detail-state">Loading project...</div>;
    }

    if (error || !project) {
        return <div className="project-detail-state error">{error || "Project not found."}</div>;
    }

    return (
        <div className="project-detail-page mb-5">
            {/* HERO SECTION */}
            <section
                className="project-hero-new"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url(${project.image || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80'})`
                }}
            >
                <div className="container h-100 position-relative d-flex flex-column justify-content-end pb-5">
                    <div className="hero-top-badges">
                        <Link to="/projectgallery" className="hero-back-btn">
                            <FaArrowLeft className="me-2" /> Back to Projects
                        </Link>
                        <span className={`hero-status-pill ${project.status === "completed" ? "completed" : "running"}`}>
                            {project.status === "completed" ? "Completed" : "Running"}
                        </span>
                    </div>

                    <div className="hero-main-content">
                        <h1 className="hero-title-new">{project.title}</h1>
                        <p className="hero-desc-new">
                            <FaMapMarkerAlt className="me-2 text-warning" />
                            {project.tagline || formatLocationSummary(project.location)}
                        </p>

                        {project.brochure && (
                            <div className="hero-action-box animated-fade-in">
                                <a
                                    href={project.brochure}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="brochure-download-btn-premium"
                                >
                                    <div className="btn-icon">
                                        <FaFilePdf />
                                    </div>
                                    <div className="btn-text">
                                        <span>Official Project Brochure</span>
                                        <strong>DOWNLOAD PDF <FaDownload className="ms-1" /></strong>
                                    </div>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* INFO CARDS ROW */}
            <div className="container info-cards-container">
                <div className="row g-4">
                    <div className="col-lg-4 col-md-6">
                        <div className="info-card-modern">
                            <div className="info-icon-box blue">
                                <FaBuilding />
                            </div>
                            <div className="info-content">
                                <span className="info-label">DEVELOPER</span>
                                <span className="info-value">{project.developer || "SOS Infrabulls"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="info-card-modern">
                            <div className="info-icon-box light-blue">
                                <FaThLarge />
                            </div>
                            <div className="info-content">
                                <span className="info-label">LAYOUT</span>
                                <span className="info-value">{project.project_layout || "—"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-12">
                        <div className="info-card-modern">
                            <div className="info-icon-box orange">
                                <FaLocationArrow />
                            </div>
                            <div className="info-content">
                                <span className="info-label">LOCATION</span>
                                <span className="info-value">
                                    {project.location?.address || formatLocationSummary(project.location)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT BODY */}
            <main className="container project-content-main mt-5">
                <div className="row gx-lg-5">
                    <div className="col-lg-7">
                        <section className="detail-section-modern">
                            <h2 className="section-title-bar">Project Overview</h2>
                            <p className="overview-text">
                                {project.location?.summary ||
                                    formatLocationSummary(project.location) ||
                                    "Detailed description will be published soon."}
                            </p>
                            <div className="overview-pills mt-3">
                                <span className="status-pill-small">{project.project_name || project.title}</span>
                                <span className="status-pill-small">
                                    {project.status === "completed" ? "Delivered milestone" : "Actively selling"}
                                </span>
                            </div>
                        </section>

                        <section className="detail-section-modern mt-5">
                            <h2 className="section-title-bar">Location Advantage</h2>
                            {advantages.length ? (
                                <ul className="advantage-list-modern">
                                    {advantages.map((item) => (
                                        <li key={item}>
                                            <FaCheckCircle className="text-primary me-2" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted italic">Proximity highlights will be updated shortly.</p>
                            )}
                        </section>
                    </div>

                    <div className="col-lg-5">
                        <section className="detail-section-modern">
                            <h2 className="section-title-bar">Amenities</h2>
                            {amenities.length ? (
                                <div className="amenities-grid-modern">
                                    {amenities.map((amenity) => (
                                        <div key={amenity} className="box-amenity">
                                            <FaStar className="star-icon" />
                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted italic">Amenity mix will be announced soon.</p>
                            )}
                        </section>
                    </div>
                </div>

                {/* CONFIGURATIONS & PRICING */}
                <div className="row mt-5">
                    <div className="col-12">
                        <section className="detail-section-modern">
                            <h2 className="section-title-bar">Configurations & Typologies</h2>
                            {configurationEntries.length ? (
                                <div className="config-grid-modern">
                                    {configurationEntries.map(([type, config]) => (
                                        <div key={type} className="modern-config-card">
                                            <h3>{type}</h3>
                                            <div className="config-divider"></div>
                                            <p>{safeArray(config?.sizes_sqft).join(", ")} sq.ft</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted italic">Configuration matrix is being curated.</p>
                            )}
                        </section>
                    </div>

                    {pricingTypes.length > 0 && (
                        <div className="col-12 mt-5">
                            <section className="detail-section-modern">
                                <h2 className="section-title-bar">Pricing Snapshot</h2>
                                <div className="modern-table-wrapper">
                                    <table className="modern-pricing-table">
                                        <thead>
                                            <tr>
                                                <th>Typology</th>
                                                <th>Rate / Sq.ft</th>
                                                <th>Electricity</th>
                                                <th>Maintenance</th>
                                                <th>Prime Charges</th>
                                                <th>Plot Sizes (Sq.ft)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pricingTypes.map((type) => (
                                                <tr key={type}>
                                                    <td><strong>{type}</strong></td>
                                                    <td>{pricing.rate_per_sqft?.[type] ?? "—"}</td>
                                                    <td>{pricing.electricity_charge?.[type] ?? "—"}</td>
                                                    <td>{pricing.maintenance?.[type] ?? "—"}</td>
                                                    <td>{pricing.prime_location_charges?.[type] ?? "—"}</td>
                                                    <td>
                                                        {Array.isArray(pricing.plot_size_sqft?.[type])
                                                            ? pricing.plot_size_sqft[type].join(", ")
                                                            : pricing.plot_size_sqft?.[type] || "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                {/* BOTTOM CTA CARD */}
                <div className="modern-cta-box-wrapper mt-5">
                    <div className="modern-cta-box">
                        <div className="cta-content">
                            <h3>Need a guided walkthrough?</h3>
                            <p>Connect with our advisory desk to receive brochures, payment plans, and site visit slots.</p>
                        </div>
                        <Link to="/contact" className="modern-gradient-btn">
                            <FaPhoneAlt className="me-2" />
                            TALK TO US
                            <FaArrowRight className="ms-3 arrow-icon" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetail;

