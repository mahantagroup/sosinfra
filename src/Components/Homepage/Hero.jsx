import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';

const HeroPremium = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentWord, setCurrentWord] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const heroRef = useRef(null);

    const slides = [
        {
            image: "https://res.cloudinary.com/dlsbj8nug/image/upload/v1782036214/1_kcqtxc.jpg",
            title: "Luxury Living Awaits",
            subtitle: "Discover premium properties tailored to your dreams"
        },
        {
            image: "https://res.cloudinary.com/dlsbj8nug/image/upload/v1782036210/2_pvdgzb.jpg",
            title: "Your Dream Home",
            subtitle: "Exceptional residences in prime locations"
        },
        {
            image: "https://res.cloudinary.com/dlsbj8nug/image/upload/v1782036217/3_xuvjci.jpg",
            title: "Premium Real Estate",
            subtitle: "Where quality meets sophistication"
        },
        {
            image: "https://res.cloudinary.com/dlsbj8nug/image/upload/v1782036200/5_j0h4n4.jpg",
            title: "Elite Properties",
            subtitle: "Curated excellence in every detail"
        }
    ];

    const rotatingWords = ['Possible', 'Beautiful', 'Exceptional'];

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [slides.length]);

    // Auto-rotate words
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord(prev => (prev + 1) % rotatingWords.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [rotatingWords.length]);

    // Scroll parallax effect
    useEffect(() => {
        const handleScroll = () => {
            if (heroRef.current) {
                const heroHeight = heroRef.current.offsetHeight;
                const scrollY = window.scrollY;
                const progress = Math.min(scrollY / heroHeight, 1);
                setScrollProgress(progress);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Calculate parallax transforms
    const getParallaxStyles = () => {
        const scale = 1 + (0.05 * (1 - scrollProgress));
        const translateY = scrollProgress * 50;
        const opacity = 1 - scrollProgress;
        
        return {
            background: {
                transform: `scale(${scale})`,
            },
            title: {
                transform: `translateY(-${translateY}px)`,
                opacity: opacity
            },
            subtitle: {
                transform: `translateY(-${translateY * 0.7}px)`,
                opacity: Math.max(opacity - 0.3, 0)
            }
        };
    };

    const parallax = getParallaxStyles();

    return (
        <section className="hero-premium" ref={heroRef}>
            {/* Background Slides */}
            <div className="hero-backgrounds">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`hero-background ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            ...parallax.background
                        }}
                    />
                ))}
            </div>

            {/* Luxury Gradient Overlay */}
            <div className="hero-overlay-premium">
                <div className="overlay-gradient"></div>
                <div className="overlay-shine"></div>
            </div>

            {/* Animated Luxury Shapes */}
            <div className="hero-shapes-premium">
                <div className="luxury-shape shape-1"></div>
                <div className="luxury-shape shape-2"></div>
                <div className="luxury-shape shape-3"></div>
                <div className="luxury-shape shape-4"></div>
            </div>

            {/* Main Content */}
            <div className="hero-content-premium">
                <div className="container">
                    <div className="hero-text-content">
                        {/* Premium Badge */}
                        {/* <div className="premium-badge">
                            <span className="badge-icon">✨</span>
                            Premium Real Estate Since 2019
                        </div> */}

                        {/* Animated Heading */}
                        <h1 className="hero-title-premium" style={parallax.title}>
                            We Make Dreams
                            <br />
                            <span className="hero-word-rotator">
                                {rotatingWords.map((word, index) => (
                                    <span
                                        key={word}
                                        className={`rotating-word ${index === currentWord ? 'active' : ''}`}
                                    >
                                        {word}
                                    </span>
                                ))}
                            </span>
                        </h1>

                        {/* Subtitle */}
                        {/* <p className="hero-subtitle-premium" style={parallax.subtitle}>
                            Discover exceptional properties in Indore's prime locations. 
                            Your journey to a dream home begins here.
                        </p> */}

                        {/* CTA Buttons */}
                        <div className="hero-cta-buttons">
                            <a href="#projects" className="cta-btn primary mx-2">
                                Explore Projects
                            </a>
                            <a href="#contact" className="cta-btn secondary mx-2">
                                Get In Touch
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator-premium">
                <div className="scroll-line"></div>
                <span>Scroll to Discover</span>
            </div>
        </section>
    );
};

export default HeroPremium;
