import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';
import './Projects.css';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Ruler, Users, ArrowRight, Home, Clock } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// Helper function from old component
const formatLocationSummary = (location) => {
    if (!location) return '';
    if (typeof location === 'string') return location;
    return location.address || '';
};

// Check for mobile layout
const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentCard, setCurrentCard] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [swiperInstance, setSwiperInstance] = useState(null);

    const trackRef = useRef(null);
    const cardsRef = useRef([]);
    const autoPlayRef = useRef(null);
    
    // Check screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // --- UTILITY FUNCTIONS ---

    const centerCard = useCallback((index) => {
        if (!trackRef.current || !cardsRef.current[index]) return;

        const card = cardsRef.current[index];
        const wrap = trackRef.current.parentElement;

        if (isMobile()) {
            wrap.scrollTo({
                top: card.offsetTop - (wrap.clientHeight / 2 - card.clientHeight / 2),
                behavior: "smooth"
            });
        } else {
            wrap.scrollTo({
                left: card.offsetLeft - (wrap.clientWidth / 2 - card.clientWidth / 2),
                behavior: "smooth"
            });
        }
    }, []);

    const activateCard = useCallback((index, shouldCenter = true) => {
        const i = Math.min(Math.max(index, 0), projects.length - 1);
        if (isMobileView) {
            if (swiperInstance) {
                swiperInstance.slideToLoop(i);
            }
            setCurrentCard(i);
            return;
        }

        if (i === currentCard) {
            if (shouldCenter) centerCard(i);
            return;
        }

        setCurrentCard(i);
        if (shouldCenter) centerCard(i);
    }, [projects.length, currentCard, centerCard, isMobileView, swiperInstance]);

    const go = (step) => {
        if (isMobileView && swiperInstance) {
            if (step > 0) {
                swiperInstance.slideNext();
            } else {
                swiperInstance.slidePrev();
            }
        } else {
            activateCard(currentCard + step, true);
        }
    };
    
    // Auto-play functionality
    useEffect(() => {
        if (isMobileView) return; // Swiper handles mobile autoplay
        if (projects.length <= 1 || isHovering) return;

        autoPlayRef.current = setInterval(() => {
            setCurrentCard(prev => {
                const next = prev >= projects.length - 1 ? 0 : prev + 1;
                centerCard(next);
                return next;
            });
        }, 5000);

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [projects.length, isHovering, centerCard, isMobileView]);

    // --- FETCH PROJECTS ---

    useEffect(() => {
        const projectsRef = collection(db, 'projects');

        const unsubscribe = onSnapshot(
            projectsRef,
            (snapshot) => {
                const projectData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const runningProjects = projectData.filter(
                    (project) => (project.status || 'running') === 'running'
                );

                setProjects(runningProjects);
                setLoading(false);

                if (runningProjects.length > 0) {
                    setCurrentCard(0);
                }
            },
            (err) => {
                console.error('Unable to load projects', err);
                setError('Unable to load running projects.');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // --- EFFECT: Center active card & handle resize ---
    useEffect(() => {
        if (projects.length > 0 && !isMobileView) {
            const timer = setTimeout(() => {
                centerCard(currentCard);
            }, 100);
            
            const handleResize = () => centerCard(currentCard);
            window.addEventListener('resize', handleResize);
            
            return () => {
                clearTimeout(timer);
                window.removeEventListener('resize', handleResize);
            }
        }
    }, [projects, currentCard, centerCard, isMobileView]);

    // --- INTERACTION HANDLERS ---

    const handleMouseEnter = (index) => {
        if (window.matchMedia("(hover: hover)").matches) {
            setIsHovering(true);
            activateCard(index, true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handleCardClick = (index) => {
        activateCard(index, true);
    };

    // --- RENDER ---
    const stateMessage = (() => {
        if (loading) return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading projects...</p>
            </div>
        );
        if (error) return (
            <div className="error-state">
                <div className="error-icon">⚠️</div>
                <p>{error}</p>
                <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
        if (projects.length === 0) return (
            <div className="empty-state">
                <div className="empty-icon">🏗️</div>
                <p>Projects will appear here once added.</p>
                <p className="empty-subtext">Check back soon for our latest developments.</p>
            </div>
        );
        return '';
    })();

    if (stateMessage) {
        return (
            <section className="slider-section">
                <div className="head container">
                    <div className="head-content">
                        <h2>Running Projects</h2>
                        <p className="">Explore our current developments and ongoing construction initiatives</p>
                    </div>
                </div>
                <div className="projects-state container">
                    {stateMessage}
                </div>
            </section>
        );
    }

    return (
        <section 
            className="slider-section"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="head container">
                <div className="head-content">
                    <div className="section-label">Our Portfolio</div>
                    <h2>Running Projects</h2>
                    <p className="section- text-left">Explore our current developments and ongoing construction initiatives</p>
                </div>
                <div className="controls">
                    <div className="control-counter">
                        <span className="current-count">{String(currentCard + 1).padStart(2, '0')}</span>
                        <span className="total-count">/{String(projects.length).padStart(2, '0')}</span>
                    </div>
                    <div className="nav-buttons">
                        <button 
                            id="prev" 
                            className="nav-btn" 
                            aria-label="Previous Project" 
                            onClick={() => go(-1)} 
                            disabled={!isMobileView && currentCard === 0}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button 
                            id="next" 
                            className="nav-btn" 
                            aria-label="Next Project" 
                            onClick={() => go(1)} 
                            disabled={!isMobileView && currentCard === projects.length - 1}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {isMobileView ? (
                <div className="mobile-projects-swiper-container">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        loop={projects.length > 1}
                        onSwiper={setSwiperInstance}
                        onSlideChange={(swiper) => {
                            setCurrentCard(swiper.realIndex);
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        className="mobile-projects-swiper"
                    >
                        {projects.map((project, index) => (
                            <SwiperSlide key={project.id}>
                                <article className="project-card active mobile-card">
                                    <div className="card-gradient-overlay"></div>
                                    <img 
                                        className="project-card__bg" 
                                        src={project.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23ffffff"/><rect x="1" y="1" width="1198" height="798" fill="none" stroke="%23000" stroke-width="2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="%23000">No Image Available</text></svg>'} 
                                        alt={project.title}
                                        loading="lazy"
                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23ffffff"/><rect x="1" y="1" width="1198" height="798" fill="none" stroke="%23000" stroke-width="2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="%23000">No Image Available</text></svg>'; }}
                                    />
                                    
                                    {/* Project Status Ribbon */}
                                    <div className="status-ribbon">
                                        <div className="ribbon-content">
                                            <Clock size={14} />
                                            <span>Running</span>
                                        </div>
                                    </div>
                                    
                                    {/* Project Stats Badge */}
                                    <div className="project-stats">
                                        {project.size && (
                                            <div className="stat-item">
                                                <Ruler size={14} />
                                                <span>{project.size}</span>
                                            </div>
                                        )}
                                        {project.units && (
                                            <div className="stat-item">
                                                <Home size={14} />
                                                <span>{project.units} units</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="project-card__content">
                                        <div className="project-card__header">
                                            <div className="project-badge">
                                                <span className="project-date">
                                                    <Calendar size={14} />
                                                    06/xx
                                                </span>
                                            </div>
                                            <h3 className="project-card__title">{project.title}</h3>
                                            <div className="project-location">
                                                <MapPin size={16} />
                                                <span>{formatLocationSummary(project.location)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="project-card__details">
                                            <div className="card-actions">
                                                <Link
                                                    to={`/projects/${project.id}`}
                                                    className="project-card__btn"
                                                >
                                                    View Full Details
                                                    <ArrowRight size={18} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                <div className="slider">
                    <div className="track" id="track" ref={trackRef}>
                        {projects.map((project, index) => (
                            <article
                                key={project.id}
                                className={`project-card ${index === currentCard ? 'active' : ''}`}
                                data-index={index}
                                ref={(el) => (cardsRef.current[index] = el)}
                                onClick={() => handleCardClick(index)}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="card-gradient-overlay"></div>
                                <img 
                                    className="project-card__bg" 
                                    src={project.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23ffffff"/><rect x="1" y="1" width="1198" height="798" fill="none" stroke="%23000" stroke-width="2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="%23000">No Image Available</text></svg>'} 
                                    alt={project.title}
                                    loading="lazy"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23ffffff"/><rect x="1" y="1" width="1198" height="798" fill="none" stroke="%23000" stroke-width="2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="%23000">No Image Available</text></svg>'; }}
                                />
                                
                                {/* Project Status Ribbon */}
                                <div className="status-ribbon">
                                    <div className="ribbon-content">
                                        <Clock size={14} />
                                        <span>Running</span>
                                    </div>
                                </div>
                                
                                {/* Project Stats Badge */}
                                <div className="project-stats">
                                    {project.size && (
                                        <div className="stat-item">
                                            <Ruler size={14} />
                                            <span>{project.size}</span>
                                        </div>
                                    )}
                                    {project.units && (
                                        <div className="stat-item">
                                            <Home size={14} />
                                            <span>{project.units} units</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="project-card__content">
                                    <div className="project-card__header">
                                        <div className="project-badge">
                                            <span className="project-date">
                                                <Calendar size={14} />
                                                06/xx
                                            </span>
                                        </div>
                                        <h3 className="project-card__title">{project.title}</h3>
                                        <div className="project-location">
                                            <MapPin size={16} />
                                            <span>{formatLocationSummary(project.location)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="project-card__details">
                                        <div className="card-actions">
                                            <Link
                                                to={`/projects/${project.id}`}
                                                className="project-card__btn"
                                            >
                                                View Full Details
                                                <ArrowRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}

            <div className="slider-footer">
                <div className="dots" id="dots">
                    {projects.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentCard ? 'active' : ''}`}
                            onClick={() => activateCard(index, true)}
                            aria-label={`Go to project ${index + 1}`}
                        >
                            <div className="dot-inner"></div>
                        </button>
                    ))}
                </div>
                <div className="view-all">
                    <Link to="/projectgallery" className="view-all-link">
                        <span>View All Projects</span>
                        <ChevronRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Projects;