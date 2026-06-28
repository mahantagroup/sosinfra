import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import './Header.css';

const PremiumHeader = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
    const mobileMenuRef = useRef(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                closeMobileMenu();
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        } else {
            document.body.style.overflow = 'unset'; // Restore body scroll
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setActiveMobileDropdown(null);
    };

    const toggleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const toggleMobileDropdown = (dropdown) => {
        setActiveMobileDropdown(activeMobileDropdown === dropdown ? null : dropdown);
    };

    return (
        <>
            <header className={`premium-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="premium-header-container">
                    <div className="premium-header-content">

                        {/* Logo Section */}
                        <div className="premium-header-brand">
                            <Link to="/" className="premium-logo">
                                <img
                                    src="https://res.cloudinary.com/dlsbj8nug/image/upload/v1782555285/logo_2x_vvvpyz.png"
                                    alt="SOS Infrabulls"
                                    width="180"
                                    height="52"
                                />
                                <div className="premium-logo-glow"></div>
                            </Link>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="premium-nav">
                            <ul className="premium-nav-list">
                                <li className="premium-nav-item">
                                    <Link to="/" className="premium-nav-link">
                                        <span className="nav-text">Home</span>
                                        <span className="nav-underline"></span>
                                    </Link>
                                </li>
                                {/* 
                                <li
                                    className={`premium-nav-item premium-dropdown ${activeDropdown === 'properties' ? 'active' : ''}`}
                                    onMouseEnter={() => setActiveDropdown('properties')}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <div
                                        className="premium-nav-link dropdown-toggle"
                                        onClick={() => toggleDropdown('properties')}
                                    >
                                        <span className="nav-text">Properties</span>
                                        <span className="nav-underline"></span>
                                        <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="premium-dropdown-menu">
                                        <div className="dropdown-content">
                                            <Link to="/property" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Property Listings</div>
                                                    // <div className="dropdown-desc">Browse Our Premium Collection</div>
                                                </div>
                                            </Link>
                                            

                                        </div>
                                    </div>
                                </li> */}
                                <li
                                    className={`premium-nav-item premium-dropdown ${activeDropdown === 'projects' ? 'active' : ''}`}
                                    onMouseEnter={() => setActiveDropdown('projects')}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <div
                                        className="premium-nav-link dropdown-toggle"
                                        onClick={() => toggleDropdown('projects')}
                                    >
                                        <span className="nav-text">Projects</span>
                                        <span className="nav-underline"></span>
                                        <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="premium-dropdown-menu">
                                        <div className="dropdown-content">
                                            <Link to="/projectgallery" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Ongoing Projects</div>
                                                    {/* <div className="dropdown-desc">Explore Our Ongoing Projects</div> */}
                                                </div>
                                            </Link>
                                            <Link to="/complete" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Completed Projects</div>
                                                    {/* <div className="dropdown-desc">Explore Our Completed Projects</div> */}
                                                </div>
                                            </Link>


                                        </div>
                                    </div>
                                </li>

                                <li
                                    className={`premium-nav-item premium-dropdown ${activeDropdown === 'about' ? 'active' : ''}`}
                                    onMouseEnter={() => setActiveDropdown('about')}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <div
                                        className="premium-nav-link dropdown-toggle"
                                        onClick={() => toggleDropdown('about')}
                                    >
                                        <span className="nav-text">Know Us</span>
                                        <span className="nav-underline"></span>
                                        <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="premium-dropdown-menu">
                                        <div className="dropdown-content">
                                            <Link to="/about" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Who we are</div>
                                                    {/* <div className="dropdown-desc">Our Story & Vision</div> */}
                                                </div>
                                            </Link>

                                            <Link to="/aboutdirector" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">About Director</div>
                                                    {/* <div className="dropdown-desc">Director's Message</div> */}
                                                </div>
                                            </Link>
                                            {/* <Link to="/gallery" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Gallery</div>
                                                    // <div className="dropdown-desc">Project Showcase</div>
                                                </div>
                                            </Link> */}
                                            {/* <Link to="/projectgallery" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Project Gallery</div>
                                                    // <div className="dropdown-desc">Project Showcase</div>
                                                </div>
                                            </Link> */}
                                            <Link to="/team" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Team Members</div>
                                                    {/* <div className="dropdown-desc">Meet Our Team</div> */}
                                                </div>
                                            </Link>
                                            <Link to="/blog" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Blog </div>
                                                    {/* <div className="dropdown-desc">Latest Updates</div> */}
                                                </div>
                                            </Link>
                                        
                                        </div>
                                    </div>
                                </li>
                                <li
                                    className={`premium-nav-item premium-dropdown ${activeDropdown === 'events' ? 'active' : ''}`}
                                    onMouseEnter={() => setActiveDropdown('events')}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <div
                                        className="premium-nav-link dropdown-toggle"
                                        onClick={() => toggleDropdown('events')}
                                    >
                                        <span className="nav-text">Events</span>
                                        <span className="nav-underline"></span>
                                        <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="premium-dropdown-menu">
                                        <div className="dropdown-content">
                                            <Link to="/gallery?section=achievements" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Achievements</div>
                                                </div>
                                            </Link>
                                            <Link to="/gallery?section=anniversary" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Anniversary</div>
                                                </div>
                                            </Link>
                                            <Link to="/gallery?section=corporate" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Corporate Meetings</div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </li>

                                <li
                                    className={`premium-nav-item premium-dropdown ${activeDropdown === 'career' ? 'active' : ''}`}
                                    onMouseEnter={() => setActiveDropdown('career')}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <div
                                        className="premium-nav-link dropdown-toggle"
                                        onClick={() => toggleDropdown('career')}
                                    >
                                        <span className="nav-text">Career</span>
                                        <span className="nav-underline"></span>
                                        <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="premium-dropdown-menu">
                                        <div className="dropdown-content">
                                            <Link to="/career" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Work With Us</div>
                                                </div>
                                            </Link>
                                            <Link to="/join" className="dropdown-link">
                                                <div>
                                                    <div className="dropdown-title">Join as ACP</div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </li>


                                <li className="premium-nav-item">
                                    <Link to="/contact" className="premium-nav-link">
                                        <span className="nav-text">Contact</span>
                                        <span className="nav-underline"></span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Header Actions */}
                        <div className="premium-header-actions">
                            {/* <button className="premium-auth-btn">
                                <span className="auth-icon">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M15.4425 16.5C15.4425 13.5975 12.555 11.25 9 11.25C5.445 11.25 2.5575 13.5975 2.5575 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </span>
                                Sign In
                            </button> */}

                            <Link to="/join" className="premium-cta-btn">
                                <span className="cta-icon">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </span>
                                Join as ACP
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className={`premium-mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                            onClick={toggleMobileMenu}
                            aria-label="Toggle mobile menu"
                        >
                            <span className="toggle-bar"></span>
                            <span className="toggle-bar"></span>
                            <span className="toggle-bar"></span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                ref={mobileMenuRef}
                className={`premium-mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
            >
                <div className="premium-mobile-container">

                    {/* Mobile Header */}
                    <div className="premium-mobile-header">
                        <Link to="/" className="premium-mobile-logo" onClick={closeMobileMenu}>
                            <img
                                src="https://res.cloudinary.com/dlsbj8nug/image/upload/v1782555285/logo_2x_vvvpyz.png"
                                alt="SOS Infrabulls"
                                width="160"
                                height="46"
                            />
                        </Link>
                        <button
                            className="premium-mobile-close"
                            onClick={closeMobileMenu}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {/* Mobile Navigation */}
                    <nav className="premium-mobile-nav">
                        <ul className="premium-mobile-nav-list">

                            {/* Home */}
                            <li className="premium-mobile-nav-item">
                                <Link to="/" className="premium-mobile-nav-link" onClick={closeMobileMenu}>
                                    <span className="mobile-nav-icon">🏠</span>
                                    Home
                                </Link>
                            </li>

                            {/* Properties */}
                            {/* <li className="premium-mobile-nav-item">
                                <div
                                    className={`premium-mobile-dropdown ${activeMobileDropdown === 'properties' ? 'active' : ''}`}
                                >
                                    <div
                                        className="mobile-dropdown-header"
                                        onClick={() => toggleMobileDropdown('properties')}
                                    >
                                        <span className="mobile-nav-icon">🏢</span>
                                        Properties
                                        <svg className="mobile-dropdown-arrow" width="16" height="16">
                                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>

                                    <div className="mobile-dropdown-content">
                                        <Link to="/property" onClick={closeMobileMenu}>Property Listings</Link>
                                    </div>
                                </div>
                            </li> */}

                            {/* Projects */}
                            <li className="premium-mobile-nav-item">
                                <div
                                    className={`premium-mobile-dropdown ${activeMobileDropdown === 'projects' ? 'active' : ''}`}
                                >
                                    <div
                                        className="mobile-dropdown-header"
                                        onClick={() => toggleMobileDropdown('projects')}
                                    >
                                        <span className="mobile-nav-icon">🏗️</span>
                                        Projects
                                        <svg className="mobile-dropdown-arrow" width="16" height="16">
                                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>

                                    <div className="mobile-dropdown-content">
                                        <Link to="/projectgallery" onClick={closeMobileMenu}>Ongoing Projects</Link>
                                        <Link to="/complete" onClick={closeMobileMenu}>Completed Projects</Link>
                                    </div>
                                </div>
                            </li>

                            {/* Know Us */}
                            <li className="premium-mobile-nav-item">
                                <div
                                    className={`premium-mobile-dropdown ${activeMobileDropdown === 'about' ? 'active' : ''}`}
                                >
                                    <div
                                        className="mobile-dropdown-header"
                                        onClick={() => toggleMobileDropdown('about')}
                                    >
                                        <span className="mobile-nav-icon">ℹ️</span>
                                        Know Us
                                        <svg className="mobile-dropdown-arrow" width="16" height="16">
                                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>

                                    <div className="mobile-dropdown-content">
                                        <Link to="/about" onClick={closeMobileMenu}>About Company</Link>
                                        <Link to="/aboutdirector" onClick={closeMobileMenu}>About Director</Link>
                                        <Link to="/blog" onClick={closeMobileMenu}>Blog & News</Link>
                                        <Link to="/team" onClick={closeMobileMenu}>Team Members</Link>
                                    </div>
                                </div>
                            </li>

                            {/* Gallery */}
                            <li className="premium-mobile-nav-item">
                                <div
                                    className={`premium-mobile-dropdown ${activeMobileDropdown === 'events' ? 'active' : ''}`}
                                >
                                    <div
                                        className="mobile-dropdown-header"
                                        onClick={() => toggleMobileDropdown('events')}
                                    >
                                        <span className="mobile-nav-icon">🎉</span>
                                        Events
                                        <svg className="mobile-dropdown-arrow" width="16" height="16">
                                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>

                                    <div className="mobile-dropdown-content">
                                        <Link to="/gallery?section=achievements" onClick={closeMobileMenu}>Achievements</Link>
                                        <Link to="/gallery?section=anniversary" onClick={closeMobileMenu}>Anniversary</Link>
                                        <Link to="/gallery?section=corporate" onClick={closeMobileMenu}>Corporate Meetings</Link>
                                    </div>
                                </div>
                            </li>
                            <li className="premium-mobile-nav-item">
                                <div
                                    className={`premium-mobile-dropdown ${activeMobileDropdown === 'career' ? 'active' : ''}`}
                                >
                                    <div
                                        className="mobile-dropdown-header"
                                        onClick={() => toggleMobileDropdown('career')}
                                    >
                                        <span className="mobile-nav-icon">👨‍💼</span>
                                        Career
                                        <svg className="mobile-dropdown-arrow" width="16" height="16">
                                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>

                                    <div className="mobile-dropdown-content">
                                        <Link to="/career" onClick={closeMobileMenu}>Work With Us</Link>
                                        <Link to="/join" onClick={closeMobileMenu}>Join as ACP</Link>
                                    </div>
                                </div>
                            </li>
                            {/* Contact */}
                            <li className="premium-mobile-nav-item">
                                <Link
                                    to="/contact"
                                    className="premium-mobile-nav-link"
                                    onClick={closeMobileMenu}
                                >
                                    <span className="mobile-nav-icon">📞</span>
                                    Contact
                                </Link>
                            </li>
                            {/* Join as ACP */}
                            <li className="premium-mobile-nav-item">
                                <Link
                                    to="/join"
                                    className="premium-mobile-cta-btn"
                                    onClick={closeMobileMenu}
                                >
                                    <span className="mobile-cta-icon">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </span>
                                    Join as ACP
                                </Link>
                            </li>


                        </ul>
                    </nav>


                    {/* Mobile Actions */}
                    {/* <div className="premium-mobile-actions">
                        <button className="premium-mobile-auth-btn">
                            <span className="mobile-auth-icon">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M17.158 19C17.158 15.134 13.866 12 10 12C6.13401 12 2.84204 15.134 2.84204 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </span>
                            Sign In / Register
                        </button>

                        <Link to="/add-property" className="premium-mobile-cta-btn" onClick={closeMobileMenu}>
                            <span className="mobile-cta-icon">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </span>
                            Submit Property
                        </Link>
                    </div> */}

                    {/* Mobile Contact Info */}
                    <div className="premium-mobile-contact">
                        <div className="mobile-contact-item">
                            <span className="contact-icon">📞</span>
                            <div>
                                <div className="contact-label">Call Us</div>
                                <a href="tel:+916262962629" className="contact-value">
                                    +91 62629-62629
                                 </a>

                            </div>
                        </div>
                        <div className="mobile-contact-item">
                            <span className="contact-icon">✉️</span>
                            <div>
                                <div className="contact-label">Email Us</div>
                                <a href="mailto:info@sosinfrabulls.com" className="contact-value">info@sosinfrabulls.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PremiumHeader;