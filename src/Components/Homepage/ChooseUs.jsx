import "./ChooseUs.css"

function ChooseUs() {    
    return (
        <section className="choose-us-section">
            <div className="ambient-light light-1"></div>
            <div className="ambient-light light-2"></div>

            <div className="container">
                <div className="section-header">
                    <span className="section-label">Why Choose Us</span>
                    <h2 className="section-title">Our Core Values</h2>
                    <p className="section-subtitle">Discover what makes SOS Infrabulls your trusted partner in real estate.</p>
                </div>
                
                <div className="cards-grid">
                    {/* SECURITY Card */}
                    <div className="premium-card">
                        <div className="card-inner">
                            <div className="card-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L4 6V12C4 16.5 6.84 20.74 12 22C17.16 20.74 20 16.5 20 12V6L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="card-title">Security</h3>
                            <p className="card-description">
                                At SOS we understand that buying a property is a significant investment. That's why we prioritize the security of the investment made by our clients. We take every measure to ensure your investment is safe and secure.
                            </p>
                        </div>
                    </div>

                    {/* OPPORTUNITY Card - The Featured Highlight */}
                    <div className="premium-card highlight-card">
                        <div className="animated-border"></div>
                        <div className="card-inner">
                            <div className="card-icon featured-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="badge-featured">Most Valued</div>
                            <h3 className="card-title">Opportunity</h3>
                            <p className="card-description">
                                We believe in providing our clients with the opportunity for growth and success. We're passionate about helping people who have invested in our properties achieve their financial goals and maximize their profits.
                            </p>
                        </div>
                    </div>

                    {/* SINCERITY Card */}
                    <div className="premium-card">
                        <div className="card-inner">
                            <div className="card-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="card-title">Sincerity</h3>
                            <p className="card-description">
                                We understand the importance of trust and transparency in the real estate industry. We work closely with you to ensure that your investment aligns with your financial goals with the utmost sincerity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ChooseUs