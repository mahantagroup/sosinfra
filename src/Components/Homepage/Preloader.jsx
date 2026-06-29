import React, { useEffect, useState } from 'react';
import './Preloader.css';

const PremiumPreloader = ({ isLoaded, onComplete }) => {
    const isPropDriven = typeof isLoaded !== 'undefined';
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (!isPropDriven) {
            // Simulate loading progress (Fallback automated mode)
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + Math.random() * 15;
                });
            }, 100);

            // Simulate total loading time
            const loadingTimer = setTimeout(() => {
                setIsLoading(false);
                setTimeout(() => {
                    setShowContent(true);
                    if (onComplete) onComplete();
                }, 800);
            }, 2500);

            return () => {
                clearInterval(progressInterval);
                clearTimeout(loadingTimer);
            };
        } else {
            // Prop-driven mode: Keep incrementing progress up to 90% until loaded
            let progressInterval;
            if (!isLoaded) {
                progressInterval = setInterval(() => {
                    setProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(progressInterval);
                            return 90;
                        }
                        return prev + Math.random() * 10;
                    });
                }, 100);
            } else {
                // Once isLoaded is true, finish loading immediately but smoothly
                setProgress(100);
                const fadeStartTimer = setTimeout(() => {
                    setIsLoading(false);
                    const finishTimer = setTimeout(() => {
                        setShowContent(true);
                        if (onComplete) onComplete();
                    }, 800);
                    return () => clearTimeout(finishTimer);
                }, 400);

                return () => clearTimeout(fadeStartTimer);
            }

            return () => {
                if (progressInterval) clearInterval(progressInterval);
            };
        }
    }, [isLoaded, isPropDriven, onComplete]);

    if (showContent) return null;

    return (
        <div className={`premium-preloader ${!isLoading ? 'preloader-hidden' : ''}`}>
            {/* Background */}
            <div className="preloader-background">
                <div className="preloader-gradient"></div>
                <div className="preloader-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="preloader-content">
                {/* Logo */}
                <div className="preloader-logo">
                    <div className="logo-container">
                        <img 
                            src="https://res.cloudinary.com/dlsbj8nug/image/upload/v1782555285/logo_2x_vvvpyz.png" 
                            alt="SOS Infrabulls" 
                            className="logo-image"
                        />
                        <div className="logo-glow"></div>
                    </div>
                </div>

                {/* Animated Text */}
                <div className="preloader-text">
                    <h1 className="company-name">SOS Infrabulls</h1>
                    <p className="company-tagline">Premium Real Estate Excellence</p>
                </div>

                {/* Progress Bar */}
                <div className="preloader-progress">
                    <div className="progress-track">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%` }}
                        >
                            <div className="progress-glow"></div>
                        </div>
                    </div>
                    <div className="progress-text">
                        <span className="progress-percent">{Math.round(progress)}%</span>
                        <span className="progress-label">Loading Premium Experience</span>
                    </div>
                </div>

                {/* Loading Animation */}
                <div className="preloader-animation">
                    <div className="animation-dots">
                        <div className="dot dot-1"></div>
                        <div className="dot dot-2"></div>
                        <div className="dot dot-3"></div>
                        <div className="dot dot-4"></div>
                    </div>
                </div>

                {/* Bottom Text */}
                <div className="preloader-bottom">
                    <p className="welcome-text">Welcome to Luxury Living</p>
                </div>
            </div>

            {/* Particles */}
            <div className="preloader-particles">
                {[...Array(15)].map((_, i) => (
                    <div key={i} className="particle" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${3 + Math.random() * 2}s`
                    }}></div>
                ))}
            </div>
        </div>
    );
};

export default PremiumPreloader;