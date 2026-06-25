import React, { useState } from "react";
import "./Career.css";
import emailjs from "@emailjs/browser";

import {
    FaChartLine,
    FaBullhorn,
} from "react-icons/fa";
// IMPORTING ALL NECESSARY ICONS
import {
    FaExternalLinkAlt, FaHandshake, FaBullseye, FaUserTie,
    FaBuilding, FaFileInvoiceDollar, FaMoneyCheckAlt,
    FaUsers, FaPhoneAlt, FaUserCheck, FaComments, FaUserCog, FaFileAlt,
    FaSearchDollar, FaPalette, FaFeatherAlt, FaHeadset, FaVideo, FaHeart,
    FaCoins, FaRocket, FaPaperPlane
} from "react-icons/fa";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

export default function Career() {
    const [showPartnerJobs, setShowPartnerJobs] = useState(false);
    const [showTeamJobs, setShowTeamJobs] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [appliedJob, setAppliedJob] = useState("");
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.send(
            "service_zlyd7te",
            "template_1vl6qfj",
            {
                job_title: appliedJob,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                dob: formData.dob,
                experience: formData.experience
            },
            "C8pltD3mWAFOY0FOB"
        )
            .then(() => {
                alert("Application sent successfully!");
                setShowForm(false);
            })
            .catch((error) => {
                console.error("EmailJS Error:", error);
                alert("Failed to send application. Try again.");
            });
    };


    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        experience: ""
    });


    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSf.../viewform";

    const businessPartnerOpenings = [
        { title: "Sales Executive", department: "Business Partner", icon: <FaHandshake /> },
        { title: "Business Manager", department: "Business Partner", icon: <FaBullseye /> },
        { title: "Vice President", department: "Business Partner", icon: <FaUserTie /> }
    ];

    const teamOpenings = {
        "Back Office": [
            { title: "Back Office Executive", icon: <FaBuilding /> }
        ],
        "Accounts": [
            { title: "Account Manager (Jr/Sr)", icon: <FaFileInvoiceDollar /> },
            { title: "Collection Coordinator", icon: <FaMoneyCheckAlt /> }
        ],
        "Sales": [
            { title: "Sales Executive", icon: <FaChartLine /> },
            { title: "Business Manager", icon: <FaUsers /> },
            { title: "Pre-Sales Coordinator", icon: <FaPhoneAlt /> }
        ],
        "HR": [
            { title: "Recruiter", icon: <FaUserCheck /> },
            { title: "Counselor", icon: <FaComments /> },
            { title: "HR Manager", icon: <FaUserCog /> }
        ],
        "IT": [
            { title: "Digital Marketing Specialist", icon: <FaSearchDollar /> },
            { title: "Graphics Designer", icon: <FaPalette /> },
            { title: "Content Writer", icon: <FaFeatherAlt /> },
            { title: "Tech Support Specialist", icon: <FaHeadset /> },
            { title: "Video Editor", icon: <FaVideo /> },
            { title: "Influencers", icon: <FaHeart /> }
        ]
    };

    const handleApply = (title) => {
        setAppliedJob(title);
        setShowForm(true);
    };

    return (
        <div className="career-page-wrapper">
            <style>{`
                .premium-hero-career {
                    position: relative;
                    min-height: 50vh;
                    display: flex;
                    align-items: center;
                    background: linear-gradient(135deg, #0A2540 0%, #061B2E 100%);
                    overflow: hidden;
                    margin-top: 33px;
                }
                .premium-hero-career::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: radial-gradient(circle at 20% 50%, rgba(201, 169, 110, 0.15) 0%, transparent 50%);
                }
                .hero-content-career { position: relative; z-index: 2; padding: 6rem 0; text-align: center; }
                .hero-title-career { font-size: 4.5rem; font-weight: 300; color: white; margin-bottom: 1.5rem; font-family: 'Georgia', serif; }
                .hero-title-career strong { font-weight: 600; color: #4A97E4; }
                .director-container-career { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
            `}</style>

            <section
                className="mt-5 pt-3"
                style={{
                    position: "relative",
                    width: "100%", // Keeping a mobile-friendly height
                    overflow: "hidden"
                }}
            >
                {/* 1. The Image Element */}
                <img
                    src="/images/img/bnr.jpeg" // Your image source
                    alt="Banner Background"

                />

                {/* 2. Light Overlay (Still needed if you want the gradient effect) */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(180deg, rgba(255,255,255,0.15), rgba(0,0,0,0.15))",
                        zIndex: 2 // Keep the overlay above the image
                    }}
                />

                {/* Optional: Content (e.g., a title) placed inside the banner */}

            </section>



            {/* SECTION 1: JOIN AS BUSINESS PARTNER */}
            <section className="career-intro-section container">
                <div className="intro-content text-center">
                    <h2 className="section-main-title">Join as Business Partner</h2>
                    <p className="intro-description">
                        Join one of India’s fastest-growing real estate sales and marketing platforms.
                        This is a profit-sharing partnership where your income grows with your performance.
                    </p>
                    <button className="career-toggle-btn" onClick={() => setShowPartnerJobs(!showPartnerJobs)}>
                        {showPartnerJobs ? "Hide Openings" : "Join as Business Partner"}
                    </button>
                </div>

                {showPartnerJobs && (
                    <div className="jobs-grid partner-grid animated-fade">
                        {businessPartnerOpenings.map((job, i) => (
                            <div className="compact-job-card" key={i}>
                                <div className="card-top">
                                    <span className="compact-badge">Partner</span>
                                    <div className="job-icon-box">{job.icon}</div>
                                </div>
                                <h3>{job.title}</h3>
                                <button onClick={() => handleApply(job.title)}>Apply Now</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* SECTION 2: JOIN AS TEAM */}
            <section className="career-intro-section container section-divider-top">
                <div className="intro-content text-center">
                    <h2 className="section-main-title">Join as Team</h2>
                    <p className="intro-description">
                        Are you driven and ready to elevate your career? We’re looking for dedicated professionals
                        passionate about property goals.
                    </p>
                    <button className="career-toggle-btn" onClick={() => setShowTeamJobs(!showTeamJobs)}>
                        {showTeamJobs ? "Hide Roles" : "Join as Team"}
                    </button>
                </div>

                {showTeamJobs && (
                    <div className="team-container animated-fade">
                        {Object.entries(teamOpenings).map(([dept, jobs], idx) => (
                            <div className="dept-group" key={idx}>
                                <h4 className="dept-label">{dept}</h4>
                                <div className="jobs-grid team-grid">
                                    {jobs.map((job, i) => (
                                        <div className="compact-job-card" key={i}>
                                            <div className="job-icon-box">{job.icon}</div>
                                            <h3>{job.title}</h3>
                                            <button onClick={() => handleApply(job.title)}>Apply Now</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* WHY JOIN US SECTION */}
            <section className="why-join-section">
                <div className="container">
                    <h2 className="section-title">
                        Key Reasons to Build Your Career with <span>SOS Infrabulls</span>
                    </h2>

                    <div className="benefits-grid">
                        {/* 1 */}
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <FaFileInvoiceDollar />
                            </div>
                            <h3>High Commission & Incentives</h3>
                            <p>
                                Industry-leading commission structure with instant performance-based
                                incentives designed to reward top achievers.
                            </p>
                        </div>

                        {/* 2 */}
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <HiOutlineOfficeBuilding />
                            </div>
                            <h3>Access to Premium Inventory</h3>
                            <p>
                                Work directly with a wide range of premium residential and commercial
                                projects that give you a strong competitive advantage.
                            </p>
                        </div>

                        {/* 3 */}
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <FaChartLine />
                            </div>
                            <h3>Accelerated Career Growth</h3>
                            <p>
                                Clear career progression, internal promotions, and expert mentorship
                                to ensure continuous and fast-paced professional growth.
                            </p>
                        </div>

                        {/* 4 */}
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <FaBullhorn />
                            </div>
                            <h3>Innovative Marketing Campaigns</h3>
                            <p>
                                Leverage cutting-edge digital marketing strategies and tools to
                                generate consistent, high-quality leads.
                            </p>
                        </div>

                        {/* 5 */}
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <FaUsers />
                            </div>
                            <h3>Collaborative & Energetic Culture</h3>
                            <p>
                                Join a motivated, high-energy team that celebrates success and works
                                together to achieve ambitious sales goals.
                            </p>
                        </div>
                    </div>

                    <div className="cta-section">
                        {/* <h3 className="text-white">Ready to Take the Next Step?</h3> */}
                        <button
                            className="cta-button"
                            onClick={() => window.open(googleFormUrl, "_blank")}
                        >
                            Apply Through Google Form <FaExternalLinkAlt />
                        </button>
                    </div>
                </div>
            </section>


            {/* MODAL FORM */}
            {showForm && (
                <div className="career-modal-backdrop" onClick={() => setShowForm(false)}>
                    <div className="career-modal-premium" onClick={e => e.stopPropagation()}>
                        <button className="close-x" onClick={() => setShowForm(false)}>&times;</button>
                        <div className="modal-top">
                            <div className="modal-icon-wrap"><FaFileAlt /></div>
                            <h2>Application Form</h2>
                            <p className="applying-for">Post: <span>{appliedJob}</span></p>
                        </div>

                        <form className="modal-form-compact" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    required
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    required
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-row">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    required
                                    onChange={handleChange}
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Contact Number"
                                    required
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-row">
                                <input
                                    type="date"
                                    name="dob"
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="experience"
                                    placeholder="Years of Experience"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="btn-row">
                                <button type="submit" className="btn-submit">
                                    Submit Application
                                </button>
                                <button type="reset" className="btn-reset">
                                    Reset
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
}