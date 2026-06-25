import React, { useEffect, useRef } from "react";
import "./Welcome.css";

function Welcome() {
    const imageRef = useRef(null);
    const textRef = useRef(null);
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const descRefs = useRef([]);

    /* -----------------------------
       ENHANCED SCROLL-BASED ANIMATIONS
    ------------------------------ */
    useEffect(() => {
        const handleScroll = () => {
            const section = sectionRef.current;
            const img = imageRef.current;
            const text = textRef.current;
            const title = titleRef.current;

            if (!section || !img || !text) return;

            const rect = section.getBoundingClientRect();
            const windowH = window.innerHeight;
            const sectionCenter = rect.top + rect.height / 2;
            const viewportCenter = windowH / 2;
            const distance = (sectionCenter - viewportCenter) / viewportCenter;
            const progress = Math.max(-0.5, Math.min(0.5, distance));

            // Smooth easing function
            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

            // IMAGE 3D with parallax
            const imgProgress = easeOutCubic(1 - Math.abs(progress));
            img.style.transform = `
                perspective(1200px)
                translateY(${progress * -25}px)
                rotateY(${progress * -4}deg)
                scale(${1 + imgProgress * 0.03})
            `;

            // TEXT parallax with fade
            text.style.transform = `
                translateY(${progress * 15}px)
            `;

            // Title animation
            if (title) {
                const titleProgress = Math.max(0, 1 - Math.abs(progress * 1.3));
                title.style.opacity = titleProgress;
                title.style.transform = `translateY(${(1 - titleProgress) * 10}px)`;
            }

            // Paragraph stagger animation
            descRefs.current.forEach((desc, index) => {
                if (desc) {
                    const delay = index * 0.1;
                    const descProgress = Math.max(0, 1 - Math.abs(progress * 1) - delay);
                    desc.style.opacity = descProgress;
                    desc.style.transform = `translateY(${(1 - descProgress) * 8}px)`;
                }
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* -----------------------------
       ENTRY ANIMATION
    ------------------------------ */
    useEffect(() => {
        const timer = setTimeout(() => {
            if (sectionRef.current) {
                sectionRef.current.style.opacity = "1";
                sectionRef.current.style.transform = "translateY(0)";
            }
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="welcome-card">
            <div
                className="welcome-section-wrapper container"
                ref={sectionRef}
                style={{
                    opacity: 0,
                    transform: "translateY(30px)",
                    transition: "opacity 0.8s ease, transform 0.8s ease"
                }}
            >
                <div className="welcome-grid">
                    {/* TEXT BLOCK */}
                    <div className="welcome-text-block" ref={textRef}>
                        <div className="box-title text-center">
                            <h3
                                className="title"
                                ref={titleRef}
                                style={{
                                    opacity: 0,
                                    transform: "translateY(20px)",
                                    transition: "all 0.6s ease 0.2s"
                                }}
                            >
                                Welcome to SOS Infrabulls
                            </h3>
                            <div className="title-divider"></div>
                        </div>

                        <div className="text-content">
                            <p
                                className="welcome-desc"
                                ref={el => descRefs.current[0] = el}
                                style={{
                                    opacity: 0,
                                    transform: "translateY(20px)",
                                    transition: "all 0.6s ease 0.3s"
                                }}
                            >
                                Welcome to <strong>SOS Infrabulls International Pvt. Ltd.</strong>! Established in <strong>2019</strong>, our company is dedicated to helping you find your dream property. Our primary focus is on <strong>Residential, Commercial, and Industrial land</strong>, offering both investment and resale deals to suit your needs.
                            </p>

                            <p
                                className="welcome-desc"
                                ref={el => descRefs.current[1] = el}
                                style={{
                                    opacity: 0,
                                    transform: "translateY(20px)",
                                    transition: "all 0.6s ease 0.4s"
                                }}
                            >
                                We invite you to explore our website and discover the wide range of properties we have to offer. With our expertise and guidance, we are confident you will find the perfect property to suit your needs.
                            </p>

                            <p
                                className="welcome-desc"
                                ref={el => descRefs.current[2] = el}
                                style={{
                                    opacity: 0,
                                    transform: "translateY(20px)",
                                    transition: "all 0.6s ease 0.5s"
                                }}
                            >
                                Thank you for choosing <strong>SOS Infrabulls International Pvt. Ltd.</strong> as your trusted partner in real estate.
                            </p>
                        </div>

                    </div>

                    {/* IMAGE BLOCK */}
                    <div className="welcome-image-box">
                        <div className="image-frame">
                            <img
                                ref={imageRef}
                                src="https://res.cloudinary.com/dlsbj8nug/image/upload/v1782036901/5th_anniversary_pic-compressed_dttg4k.jpg"
                                alt="SOS Infrabulls"
                                className="welcome-image"
                                loading="lazy"
                            />
                            <div className="image-shine"></div>
                        </div>
                    </div>
                </div>
            </div >
        </section>
    );
}

export default Welcome;