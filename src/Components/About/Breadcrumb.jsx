import React from 'react'
import { Link } from 'react-router-dom'
function Breadcrumb() {
    return (
        <>
            <style>{`
                .premium-hero {
                    position: relative;
                    min-height: 50vh;
                    display: flex;
                    align-items: center;
                    background: linear-gradient(135deg, #0A2540 0%, #061B2E 100%);
                    overflow: hidden;
                    margin-top: 33px;
                }

                .premium-hero::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 20% 50%, rgba(201, 169, 110, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                    padding: 6rem 0;
                    text-align: center;
                }

                .hero-title {
                    font-size: 4.5rem;
                    font-weight: 300;
                    letter-spacing: -0.02em;
                    color: white;
                    margin-bottom: 1.5rem;
                    font-family: 'Georgia', serif;
                }

                .hero-title strong {
                    font-weight: 600;
                    color: #4A97E4;
                }

                .director-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                @media (max-width: 992px) {
                    .hero-title {
                        font-size: 3.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .hero-title {
                        font-size: 2.8rem;
                    }
                }
            `}</style>
            {/* <section className="premium-hero">
                <div className="director-container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            About <strong>Us</strong>
                        </h1>
                        <p className="text-white text-lg opacity-80">
                            Guiding Mahanta Group with wisdom, integrity, and forward-thinking vision
                        </p>
                    </div>
                </div>
            </section> */}
        </>
    )
}

export default Breadcrumb